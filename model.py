import pickle
from sklearn.linear_model import LogisticRegression

class Model():
    def __init__(self):
        self.lr = LogisticRegression()
        self.model = None

    def fit(self, X, y):
        self.model = self.lr.fit(X, y)

    def predict(self, X):
        return self.model.predict(X)

    def predict_proba(self, X):
        return self.model.predict_proba(X)

# if __name__ == '__main__':
#     X, y = get_data('data/data.json')
#     model = Model()
#     model.fit(X, y)
#     with open('model.pkl', 'wb') as f:
#         # Write the model to a file.
#         pickle.dump(model, f)
