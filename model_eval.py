import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import cross_validate
from sklearn.metrics import f1_score

class ModelEvaluator():
    def __init__(self, X, y, trait):
        self.X = X
        self.y = y
        self.trait = trait
        self.models_dict = {
            'LogisticRegression': LogisticRegression(),
            'RandomForestClassifier': RandomForestClassifier(),
            'MultinomialNB': MultinomialNB(),
            'GradientBoostingClassifier': GradientBoostingClassifier()
        }
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.33, random_state=32)


    def compare_scores(self, models):
        print('Model performance for trait ' + self.trait + ' prediction:' + '\n')

        accuracy_scores = []
        f1_scores = []

        for model_name in models:
            model = self.models_dict[model_name]
            model.fit(self.X_train, self.y_train)

            accuracy_score = np.mean(cross_validate(model, self.X_test, self.y_test, cv=10)['test_score'])
            y_pred = model.predict(self.X_test)
            y_true = self.y_test
            f_score = f1_score(y_true, y_pred)

            accuracy_scores.append(accuracy_score)
            f1_scores.append(f_score)

            print(
                model_name + ": " + '\n' +
                'Accuracy score: ' + str(accuracy_score) + '\n'
                'F1 score: ' + str(f_score) + '\n'
            )
        best_accuracy_score = max(accuracy_scores)
        best_accuracy_model = models[accuracy_scores.index(best_accuracy_score)]

        best_f1_score = min(f1_scores)
        best_f1_model = models[f1_scores.index(best_f1_score)]

        print(
            'Highest Accuracy score: ' + str(best_accuracy_score) + '\n' +
            'Model: ' + best_accuracy_model + '\n' + '\n' +
            'Lowest F1 score: ' + str(best_f1_score) + '\n' +
            'Model: ' + best_f1_model + '\n'
        )
