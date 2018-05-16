import pandas as pd
import numpy as np
import scipy.stats as stats

class Big5():
	def __init__(self):
		self.df = pd.read_csv('data/BIG5/data.csv', sep='\t')
		self.prep_df()

	def calc_score(self, df):
	    score = []
	    for row in df.values:
	        score.append(row.mean())
	    return score
	    
	# def calc_percentile(self, score, trait):
	# 	if trait == 'O':
	# 		pop_scores = self.df['O_score']
	# 	if trait == 'C':
	# 		pop_scores = self.df['C_score']
	# 	if trait == 'E':
	# 		pop_scores = self.df['E_score']
	# 	if trait == 'A':
	# 		pop_scores = self.df['A_score']
	# 	if trait == 'N':
	# 		pop_scores = self.df['N_score']

	# 	possible_percentiles = list(range(101))
		
	# 	score_percentiles = []
	    
	# 	for perc in possible_percentiles:
	# 		score_percentiles.append(np.percentile(pop_scores, perc))
	        
	# 	calc_perc = 0
	# 	for score_perc, perc in zip(score_percentiles, possible_percentiles):
	# 		if int(score_perc) >= score:
	# 			calc_perc = perc
	# 			break
	# 		elif int(score_perc) > score:
	# 			break

	# 	return calc_perc

	def prep_df(self):
		O_columns = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10']
		C_columns = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10']
		E_columns = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10']
		A_columns = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']
		N_columns = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10']

		self.df['O_score'] = self.calc_score(self.df[O_columns])
		self.df['C_score'] = self.calc_score(self.df[C_columns])
		self.df['E_score'] = self.calc_score(self.df[E_columns])
		self.df['A_score'] = self.calc_score(self.df[A_columns])
		self.df['N_score'] = self.calc_score(self.df[N_columns])

		# self.df['O_percentile'] = self.df['O_score'].apply(lambda x: stats.percentileofscore(self.df['O_score'].sort_values(),x))
		# self.df['C_percentile'] = self.df['C_score'].apply(lambda x: stats.percentileofscore(self.df['C_score'].sort_values(),x))
		# self.df['E_percentile'] = self.df['E_score'].apply(lambda x: stats.percentileofscore(self.df['E_score'].sort_values(),x))
		# self.df['A_percentile'] = self.df['A_score'].apply(lambda x: stats.percentileofscore(self.df['A_score'].sort_values(),x))
		# self.df['N_percentile'] = self.df['N_score'].apply(lambda x: stats.percentileofscore(self.df['N_score'].sort_values(),x))

