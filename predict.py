import pymongo
import pandas as pd
import pickle
from data_prep import DataPrep
from model import Model
from sklearn.preprocessing import MinMaxScaler
from bs4 import BeautifulSoup
from open_psychometrics import Big5
import scipy.stats as stats
from math import pi
import matplotlib.pyplot as plt

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

                
                trait_scores = pkl_model.predict(X, regression=True).reshape(1, -1)
                # scaler = MinMaxScaler(feature_range=(0, 50))
                # print(scaler.fit_transform(trait_scores))
                # scaled_trait_scores = scaler.fit_transform(trait_scores)
                predictions['pred_s'+trait] = trait_scores.flatten()[0]
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
            'name': 1,
            'url': 1,
            'datetime': 1,
            'status_predictions': 1,
            'avg_status_predictions': 1,
            'profile_pic_url': 1,
            'pred_percentiles': 1,
            'radar_plot_url': 1,
            '_id': 0}))
        return entries

    def add_profile_pic(self):

        entries = list(self.fb_statuses.find({'friends_dict': {'$exists': False}}, {
            'html': 1,
            'url': 1,
            '_id': 0}))
        for entry in entries:
            url = entry['url']
            html = entry['html']
            soup = BeautifulSoup(html, 'html.parser')
            try:
                profile_pic_url = soup.select('a[class*=profilePicThumb] img')[0]['src']
            except:
                profile_pic_url = 'http://www.seamedu.com/wp-content/uploads/2018/01/dummy-profile-pic.png'
            self.fb_statuses.update_one(
                            {'url': url},
                            {'$set': {
                                'profile_pic_url': profile_pic_url,
                                }
                            },
                        upsert=True
                        )
            print('Scraping...')
        print('Done!')

    def add_percentiles(self):
        B = Big5()

        entries = list(self.fb_statuses.find({'friends_dict': {'$exists': False}}, {
            'avg_status_predictions': 1,
            'url': 1,
            'name': 1,
            '_id': 0}))

        scores_labels = ['avg_pred_sOPN', 'avg_pred_sCON', 'avg_pred_sEXT', 'avg_pred_sAGR', 'avg_pred_sNEU']
        big5_labels = ['O_score', 'C_score', 'E_score', 'A_score', 'N_score']
        percs_labels = ['pred_perc_sOPN', 'pred_perc_sCON', 'pred_perc_sEXT', 'pred_perc_sAGR', 'pred_perc_sNEU']

        for entry in entries:
            name = entry['name']
            url = entry['url']
            print('Calculating percentiles for ' + name + '...')
            perc_dict = {}
            try:
                preds = entry['avg_status_predictions']

                for idx, trait_label in enumerate(scores_labels):
                    score = preds[trait_label]
                    perc = stats.percentileofscore(B.df[big5_labels[idx]], score)
                    perc_dict[percs_labels[idx]] = perc

                self.fb_statuses.update_one(
                                {'url': url},
                                {'$set': {
                                    'pred_percentiles': perc_dict,
                                    }
                                },
                            upsert=True
                            )
            except:
                print('Error')

    # Radar plot for personality
    def create_plot(self, values, name):
        plt.cla()
        plt.clf()
        traits = [
            'Openness',
            'Conscientiousness',
            'Extraversion',
            'Agreeableness',
            'Neuroticism'
        ]

        N = len(traits)

        # We are going to plot the first line of the data frame.
        # But we need to repeat the first value to close the circular graph:
        # values=person[self.traits].values.flatten().tolist()
        values += values[:1]
        values

        # What will be the angle of each axis in the plot? (we divide the plot / number of variable)
        angles = [n / float(N) * 2 * pi for n in range(N)]
        angles += angles[:1]

        # Initialise the spider plot
        ax = plt.subplot(111, polar=True)

        # Draw one axe per variable + add labels labels yet
        plt.xticks(angles[:-1], traits, color='grey', size=11)

        # Draw ylabels
        ax.set_rlabel_position(0)
        plt.yticks([10,20,30,40,50,60,70,80,90], ["10","20","30",'40','50','60','70','80','90'], color="grey", size=8)
        plt.ylim(0,100)

        # Plot data
        ax.plot(angles, values, linewidth=1, linestyle='solid')

        # Fill area
        ax.fill(angles, values, 'b', alpha=0.1)

        plt.savefig('static/images/' + name + '.png')

    def create_radar_plots(self):
        entries = list(self.fb_statuses.find({'friends_dict': {'$exists': False}}, {
            'url': 1,
            'name': 1,
            'pred_percentiles': 1,
            '_id': 0}))

        for entry in entries:
            name = entry['name']
            url = entry['url']
            try:
                pred_dict = entry['pred_percentiles']
                self.create_plot(list(pred_dict.values()), name)
                radar_plot_url = 'images/' + name + '.png'
                self.fb_statuses.update_one(
                            {'url': url},
                            {'$set': {
                                'radar_plot_url': radar_plot_url,
                                }
                            },
                        upsert=True
                        )
                print('Creating radar plot for ' + name + '...')
            except:
                print('Error!')


if __name__ == '__main__':
    P = Predictor()
    # P.add_profile_pic()
    # P.predict_fb_statuses()
    # P.agg_avg_personality()
    # P.insert_avgs_into_db()
    # P.add_percentiles()
    P.create_radar_plots()
