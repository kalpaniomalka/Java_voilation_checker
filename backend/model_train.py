#import libraries
import string
import re
import codecs
import numpy as np
import pandas as pd
import seaborn as sns
#import matpotlib.pyplot as plt
from sklearn import feature_extraction
from sklearn import linear_model
from sklearn import pipeline
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn.metrics import accuracy_score
import pickle

#read data set
java_df = pd.read_csv("data.csv","utf-8",header=None, names=["JAVA"], usecols=[0],engine='python')
java_df.head()

test_df = pd.read_csv("data_NJ.csv","utf-8",header=None, names=["TEST"], usecols=[0],engine='python')
test_df.head()

#punctuation
for char in string.punctuation:
	print(char, end="")
translate_table = dict((ord(char), None) for char in string.punctuation)

data_java = []
lang_java = []

data_test = []
lang_test = []

#loop through dataset and remove punctuation
for i,line in java_df.iterrows():
	line = line["JAVA"]
	if len(line) !=0:
		line = line.lower()
		line = re.sub(r"\d+", "", line)
		line = line.translate(translate_table)
		data_java.append(line)
		lang_java.append("JAVA")

for i,line in test_df.iterrows():
	line = line["TEST"]
	if len(line) !=0:
		line = line.lower()
		line = re.sub(r"\d+", "", line)
		line = line.translate(translate_table)
		data_test.append(line)
		lang_test.append("TEST")

#create a data frame
df = pd.DataFrame({"Text":data_java+data_test, "Language":lang_java+lang_test})
print(df.shape)

#devide dataset into test dataset and training dataset
x, y = df.iloc[:, 0],df.iloc[:,1]
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=0)

print(x_train.shape)
print(x_test.shape)
print(y_train.shape)
print(y_test.shape)

vectorizer = feature_extraction.text.TfidfVectorizer(ngram_range=(1,3),analyzer='char')

pipe_lr_r13 = pipeline.Pipeline([
	('vectorizer', vectorizer),
	('clf', linear_model.LogisticRegression())
])

pipe_lr_r13.fit(x_train, y_train)

y_predicted = pipe_lr_r13.predict(x_test)

acc = (metrics.accuracy_score(y_test, y_predicted))*100
print("Test Data Accuracy: "+str(acc))

matrix = metrics.confusion_matrix(y_test,y_predicted)
print('Confusion matrix : \n', matrix)

#write pikl file
lrFile = open('JavaModel.pckl', 'wb')
pickle.dump(pipe_lr_r13, lrFile)
lrFile.close()
