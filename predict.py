import pymongo
import pandas as pd
import pickle
from data_prep import DataPrep
from model import Model
from sklearn.preprocessing import MinMaxScaler

class Predictor():
    def __init__(self):
        self.mc = pymongo.MongoClient()
        self.db = self.mc['my-facebook-webscrape']
        self.fb_statuses = self.db['fb-statuses']

        self.traits = ['OPN', 'CON', 'EXT', 'AGR', 'NEU']
        self.models = {}
        self.load_models()
        self.df = self.load_df()
        self.df = self.agg_avg_personality()

    def load_df(self):
        entries = list(self.fb_statuses.find({'friends_dict': {'$exists': False}}, {
            'statuses':1,
            'name':1,
            'status_predictions': 1,
            '_id':0}))

        df_dict = {'NAME': [], 'DATE': [],
                   'pred_sOPN': [], 'pred_sCON': [], 'pred_sEXT': [], 'pred_sAGR': [], 'pred_sNEU': [],
                   'pred_prob_cOPN': [], 'pred_prob_cCON': [], 'pred_prob_cEXT': [], 'pred_prob_cAGR': [], 'pred_prob_cNEU': [],
                   'pred_cOPN': [], 'pred_cCON': [], 'pred_cEXT': [], 'pred_cAGR': [], 'pred_cNEU': [],
                   'STATUS': []}

        for entry in entries:
            # name = self.anonymize_name(name)
            name = entry['name']
            statuses = entry['statuses']
            predictions = entry['status_predictions']

            for date, status in statuses.items():
                df_dict['NAME'].append(name)
                df_dict['DATE'].append(date)
                df_dict['STATUS'].append(status)

                status_predictions = predictions[date]
                for key, value in status_predictions.items():
                    df_dict[key].append(value)

        df = pd.DataFrame(df_dict)
        df['STATUS_COUNT'] = df.groupby("NAME")["STATUS"].transform('count')
        return df

    def load_models(self):
        M = Model()
        for trait in self.traits:
            with open(trait + '_model.pkl', 'rb') as f:
                self.models[trait] = pickle.load(f)

    def predict(self, X, traits='All', predictions='All'):
        predictions = {}
        if traits == 'All':
            for trait in self.traits:
                pkl_model = self.models[trait]

                scaler = MinMaxScaler(feature_range=(0, 50))
                trait_scores = pkl_model.predict(X, regression=True).reshape(1, -1)
                scaled_trait_scores = scaler.fit_transform(trait_scores)
                predictions['pred_s'+trait] = scaled_trait_scores.flatten()[0]
                # predictions['pred_s'+trait] = scaled_trait_scores.flatten()

                trait_categories = pkl_model.predict(X, regression=False)
                predictions['pred_c'+trait] = str(trait_categories[0])
                # predictions['pred_c'+trait] = trait_categories

                trait_categories_probs = pkl_model.predict_proba(X)
                predictions['pred_prob_c'+trait] = trait_categories_probs[:, 1][0]
                # predictions['pred_prob_c'+trait] = trait_categories_probs[:, 1]

        return predictions

    def predict_fb_statuses(self):
        statuses = list(self.fb_statuses.find({'friends_dict': {'$exists': False}}, {'statuses':1, '_id':1, 'name': 1}))

        for entry in statuses:
            entry_id = entry['_id']
            entry_statuses = entry['statuses']
            entry_name = entry['name']

            print('Making predictions for ' + entry_name + "'s statuses...")

            predictions_dict = {}
            for key, value in entry_statuses.items():
                print('Predicting personality for status "' + value + '"')
                predictions_dict[key] = self.predict([value])

            self.fb_statuses.update_one(
                        {'_id': entry_id},
                        {'$set': {
                            'status_predictions': predictions_dict,
                            }
                        },
                    upsert=True
                    )
    def agg_avg_personality(self):
        # df_mean_scores = df.groupby('NAME')[[
        #     'pred_sOPN', 'pred_sCON', 'pred_sEXT', 'pred_sAGR', 'pred_sNEU',
        # ]].mean()

        df_mean_scores = self.df.groupby(['NAME'], as_index=False).agg(
                              {'pred_sOPN':['mean'], 'pred_sCON':['mean'], 'pred_sEXT':['mean'], 'pred_sAGR':['mean'], 'pred_sNEU':['mean']})

        df_mean_scores.columns = ['NAME', 'avg_pred_sOPN', 'avg_pred_sCON', 'avg_pred_sEXT', 'avg_pred_sAGR', 'avg_pred_sNEU']

        df = self.df.merge(df_mean_scores, how='right', on='NAME')

        # df_mean_scores = df.groupby('NAME')[[
        #     'pred_prob_cOPN', 'pred_prob_cCON', 'pred_prob_cEXT', 'pred_prob_cAGR', 'pred_prob_cNEU'
        # ]].mean()

        df_mean_probs = df.groupby(['NAME'], as_index=False).agg(
                              {'pred_prob_cOPN':['mean'], 'pred_prob_cCON':['mean'], 'pred_prob_cEXT':['mean'], 'pred_prob_cAGR':['mean'], 'pred_prob_cNEU':['mean']})
        df_mean_probs.columns = ['NAME', 'avg_pred_prob_cOPN', 'avg_pred_prob_cCON', 'avg_pred_prob_cEXT', 'avg_pred_prob_cAGR', 'avg_pred_prob_cNEU']

        df = df.merge(df_mean_probs, how='right', on='NAME')

        return df

    def insert_avgs_into_db(self):
        cols = ['DATE', 'NAME',
            'avg_pred_prob_cOPN', 'avg_pred_prob_cCON', 'avg_pred_prob_cEXT', 'avg_pred_prob_cAGR', 'avg_pred_prob_cNEU',
            'avg_pred_sOPN', 'avg_pred_sCON', 'avg_pred_sEXT', 'avg_pred_sAGR', 'avg_pred_sNEU'
           ]

        avg_values = self.df[cols].values

        for status_idx, status in enumerate(avg_values):
            date = status[0]
            name = status[1]
            print('Inserting ' + name +"'s average personality scores to database...")
            avg_personality = {}
            for col_idx, col in enumerate(status):
                col_name = cols[col_idx]
                avg_personality[col_name] = col

            self.fb_statuses.update_one(
                        {'name': name},
                        {'$set': {
                            'avg_status_predictions': avg_personality,
                            }
                        },
                    upsert=True
                    )
            print('Done!')

    def my_network_json(self):
        entries = list(self.fb_statuses.find({'friends_dict': {'$exists': False}}, {
            'statuses': 1,
            'name': 1,
            'url': 1,
            'datetime': 1,
            'status_predictions': 1,
            'avg_status_predictions': 1,
            '_id': 0}))
        return entries

# if __name__ == '__main__':
#     P = Predictor()
#     P.insert_avgs_into_db()
