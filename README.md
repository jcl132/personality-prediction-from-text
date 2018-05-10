Personality Prediction from Text


Business

This project would train a machine learning model to predict a person’s personality based on a sample of their writing or from something they’ve authored (Facebook status). The personality model I want to use is the Five Factor Model, or Big Five, since it’s currently the most studied personality model in the scientific literature. The Big Five consists of five personality factors statistically derived from an analysis of vocabulary people use to describe their own and others personalities. The five traits are Openness (O), Conscientiousness (C), Extraversion (E), Agreeableness (A), and Neuroticism (N), easily remembered with the acronym OCEAN.
Personality has been found to be correlated to various different phenomena, such as academic and workplace performance (C), susceptibility to various mental disorders (N), creativity (O), how people experience positive emotion (E) and how people interact with one another (A). Knowing or estimating a customer or user’s personality can give valuable insights related to potential effective advertisements, interest in certain products and probability of a sale. Businesses can leverage personality to make better decisions about how to better serve their customers.


Data Understanding

There a few different data sources I would use to gather the relevant personality and text data. The first source is from a paper in the field of personality prediction from text ‘Deep Learning-Based Document Modeling for Personality Detection from Text’ by Cambria et al. (http://sentic.net/deep-learning-based-personality-detection.pdf)  which has the essay and personality data from Pennebaker and King and also their corresponding Mairese features and Linguistic Inquiry and Word Count features (LIWC), both features for extracting psychological traits from text. This dataset is publicly available and already has been downloaded.
A second source is from the myPersonality project dataset (http://mypersonality.org/wiki/doku.php?id=wcpr13) which has a list of Facebook statuses and other Facebook features such as network size, betweenness and density as well as corresponding personality scores.
The previous two data sources would be used to train a machine learning model to generate estimated personality scores based on text. I would then web scrape my own Facebook account for Facebook statuses and comments from my own network, and try to estimate people’s personalities. The generated personality score database from my own network can be used to generate interesting relationship metrics about people in my life (most similar/least similar, party/group compatibility, individual differences, person to person compatibility).


Data Preparation

The previous data sources would firstly need to be standardized to a standard scale since personality testing scores can use ranges of 1-7 or 1-5 for questions and also vary depending on type of personality trait (Emotional Stability is the opposite of Neuroticism). Some datasets also only show classification scores and not continuous scores, which need to be standardized. Depending on the ensemble of models being used, I might also need to extract the LIWC and Mairesse features from the Facebook statuses, since only the essay dataset has those features labelled.


Modeling

This project could use multiple models, namely Logistic Regression, Gradient Boosted Classifier, Neural Networks, Naive Bayes or Random Forest. Since there are five different personality factors, I could train five separate models that predict each trait based on text.
Since I have two different datasets to train my models, I would perhaps have to tune different models for different use cases. A longer form stream of consciousness essay might be better or worse for training a model to predict personality. Depending upon model performance, different techniques and ensemble methods need to be used to find the best possible algorithm given the various models and data.
Depending on results, both continuous and discrete prediction is possible. Categorical (binary classification for each personality trait) or continuous score prediction. From the current literature, it seems ranking algorithms tend to work best, since personality percentiles are calculated relative to other scores in the population. I could use a ranking algorithm, however more learning is required to implement since I am not familiar with any from the current course curriculum.


Evaluation

To evaluate the model, I will compare the models performance on Facebook status and personality dataset which would be split into a training and test set many times using K fold cross validation. A log loss score could be used to compare multiple models and evaluate the most predictive and interpretable. I could also compare my loss function scores to any of the current models and methods in the current literature. There are various models and methods being used in the current literature such as SVM, Naive Bayes, and CNNs. Depending on the method, I will compare my model and use the literature model scores as a baseline.


Deployment

I would make a presentation and push it onto github. However, I also have a public website that I could publish my results on. A creative way to implement this project is as an actual personality test, with an input form containing a proper Big Five question set to create a score for each user. This score can be used to compare to other people in the database to calculate the same relationship metrics from above. There may also be an input field to write or paste in a piece of text to try and predict a personality profile based on that text, and to calculate error by comparing the predicted score to the actual score.
