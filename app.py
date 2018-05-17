from __future__ import division
from math import sqrt
from flask import Flask, render_template, request, jsonify
from collections import Counter
from flask import Flask, request
from fb_predictions import FBPredictions
from predict import Predictor
from model import Model
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import json
from bson import json_util

app = Flask(__name__)

# FBP = FBPredictions()
M = Model()
predictor = Predictor()

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    text = request.json
    prediction =  predictor.predict([text])
    # prediction = pd.DataFrame(prediction).to_html()
    # return prediction
    # return jsonify({'prediction': str(prediction)})
    return jsonify(prediction)
    #
    # return render_template('index.txt', predictions=prediction)

@app.route('/my_network', methods=['GET'])
def my_network():
    my_network_predictions = predictor.my_network_json()
    return json.dumps(my_network_predictions, default=json_util.default)
    # return jsonify(my_network_predictions)
    #
    # return render_template('index.txt', predictions=prediction)

@app.route('/my_personality', methods=['GET'])
def my_personality():
    my_personality = predictor.my_personality_json()
    return json.dumps(my_personality, default=json_util.default)
    # return jsonify(my_network_predictions)
    #
    # return render_template('index.txt', predictions=prediction)

@app.route('/submit_personality_test', methods=['POST'])
def submit_personality_test():
    answers = request.json
    result = predictor.submit_personality_test(answers)

    return jsonify(result)
    # return jsonify(my_network_predictions)
    #
    # return render_template('index.txt', predictions=prediction)

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=True)
