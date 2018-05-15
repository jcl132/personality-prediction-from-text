from __future__ import division
from math import sqrt
from flask import Flask, render_template, request, jsonify
from collections import Counter
from flask import Flask, request
# from build_model import TextClassifier, get_data
from fb_predictions import FBPredictions
from predict import Predictor
from model import Model
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
app = Flask(__name__)

# FBP = FBPredictions()
predictor = Predictor()

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def solve():
    text = request.json
    prediction =  predictor.predict([text])
    # prediction = pd.DataFrame(prediction).to_html()
    # return prediction
    # return jsonify({'prediction': str(prediction)})
    return jsonify(prediction)
    #
    # return render_template('index.txt', predictions=prediction)

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=True)
