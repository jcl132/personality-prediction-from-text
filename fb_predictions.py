import pymongo
import pandas as pd
import pickle
from data_prep import DataPrep
from model import Model
from sklearn.preprocessing import MinMaxScaler

class FBPredictions():
    def __init__(self):
        self.mc = pymongo.MongoClient()
        self.db = self.mc['my-facebook-webscrape']
        self.fb_statuses = self.db['fb-statuses']

        self.traits = ['OPN', 'CON', 'EXT', 'AGR', 'NEU']

        self.df = self.load_df()

        self.add_predictions()



    def render_html(self):
        return self.df.to_html()

    def anonymize_name(self, name):
        output = ""
        for i in name.split():
            output += i[0] + '.'
        return output

    def load_df(self):
        entries = list(fb_statuses.find({'friends_dict': {'$exists': False}}, {
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

    def add_predictions(self):
        for trait in self.traits:
            pkl_model = pickle.load(open(trait + '_model.pkl', "rb"))
            dp = DataPrep()
            X = self.df['STATUS']

            trait_scores = pkl_model.predict(X, regression=True)
            self.df['pred_s'+trait] = trait_scores

            trait_categories = pkl_model.predict(X, regression=False)
            self.df['pred_c'+trait] = trait_categories

            trait_categories_probs = pkl_model.predict_proba(X)
            self.df['pred_prob_c'+trait] = trait_categories_probs[:, 1]

        trait_scores = [
            'pred_sOPN', 'pred_sCON', 'pred_sEXT', 'pred_sAGR', 'pred_sNEU',
        ]

        scaler = MinMaxScaler(feature_range=(0, 50))
        scores = self.df[trait_scores]
        scaled_scores = scaler.fit_transform(scores)

        df_scaled = pd.DataFrame(scaled_scores)
        df_scaled.columns = trait_scores

        for col in trait_scores:
            self.df[col] = df_scaled[col]

# if __name__ == '__main__':
#     FBP = FBPredictions()
