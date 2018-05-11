import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge, SGDRegressor
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import cross_validate
from sklearn.metrics import f1_score, mean_squared_error


class ModelEvaluator():
    def __init__(self, X, y, trait):
        self.X = X
        self.y = y
        self.trait = trait
        self.models_dict = {
            'LogisticRegression': LogisticRegression(),
            'RandomForestClassifier': RandomForestClassifier(max_features='sqrt', n_estimators=110),
            'MultinomialNB': MultinomialNB(),
            'GradientBoostingClassifier': GradientBoostingClassifier(),
            'SVC': SVC(),
            'LinearRegression': LinearRegression(),
            'RandomForestRegressor' : RandomForestRegressor(),
            'Ridge': Ridge(),
            'SGDRegressor': SGDRegressor(),
        }
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.33, random_state=32)
        self.hyperparameters = {
        'RandomForestClassifier': {'max_features': 'sqrt', 'n_estimators': 110},

        }

    # def tune_hyperparameters(self):
    #     for model_name, model in self.models_dict.items():
    #
    #         param_grid = {
    #             'n_estimators': [50, 100, 150, 200],
    #             'max_features': ['auto', 'sqrt', 'log2']
    #         }
    #
    #         CV = GridSearchCV(estimator=model, param_grid=param_grid, cv= 5)
    #         CV.fit(self.X, self.y)
    #         CV.best_params_)

    def compare_scores(self, models, regression=False):
        print('Model performance for trait ' + self.trait + ' prediction:' + '\n')

        accuracy_scores = []
        f1_scores = []

        for model_name in models:
            model = self.models_dict[model_name]
            model.fit(self.X_train, self.y_train)

            print(model_name + ": ")

            if regression:
                y_pred = model.predict(self.X_test)
                y_true = self.y_test
                mse = -np.mean(cross_validate(model, self.X_test, self.y_test, scoring='neg_mean_squared_error', cv=10)['test_score'])
                print('MSE: ' + str(mse) + '\n')
            else:
                accuracy_score = np.mean(cross_validate(model, self.X_test, self.y_test, cv=10)['test_score'])
                accuracy_scores.append(accuracy_score)
                print('Accuracy score: ' + str(accuracy_score) + '\n')

                # y_pred = model.predict(self.X_test).round()
                # y_true = self.y_test
                # f_score = f1_score(y_true, y_pred)
                f_score = np.mean(cross_validate(model, self.X_test, self.y_test, scoring='f1', cv=10)['test_score'])
                f1_scores.append(f_score)
                print('F1 score: ' + str(f_score) + '\n')

        if regression:
            pass
        else:
            best_accuracy_score = max(accuracy_scores)
            best_accuracy_model = models[accuracy_scores.index(best_accuracy_score)]
            print(
                'Best Accuracy score: ' + str(best_accuracy_score) + '\n' +
                'Model: ' + best_accuracy_model + '\n' + '\n'
            )
            best_f1_score = max(f1_scores)
            best_f1_model = models[f1_scores.index(best_f1_score)]
            print(
                'Best F1 score: ' + str(best_f1_score) + '\n' +
                'Model: ' + best_f1_model + '\n'
            )
