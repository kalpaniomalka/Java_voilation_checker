import numpy as np
import string
import re
import pickle
from flask import Flask
from flask import request
from bson.json_util import dumps
from flask_cors import CORS
import functools

app  = Flask("__main__")
CORS(app)

#function to identify language
@app.route('/api/insertCode', methods=['GET']) 
def LanguageDetection():
    text = request.args.get('code')
    
    #Remove comments
    s = re.sub(re.compile(r"/\*.*?\*/*?\n",re.DOTALL ) ,"" ,text) 

    #Open txt file and write uploaded source code
    f= open("source.txt","w+")
    f.write(s)
    f.close()

    global lrLangDetectModel
    translate_table = dict((ord(char), None) for char in string.punctuation)

    #load the model
    lrLangDetectFile = open('JavaModel.pckl', 'rb')
    lrLangDetectModel = pickle.load(lrLangDetectFile)
    lrLangDetectFile.close()

    text = " ".join(text.split())
    text = text.lower()
    text = re.sub(r"\d+", "", text)
    text = text.translate(translate_table)
    pred = lrLangDetectModel.predict([text])

    return pred[0]

#Rule 1 - God Class
@app.route('/api/godClass', methods=['GET']) 
def GodClass():
    with open('source.txt', 'r') as file:
        content = file.read()

    pattern = re.compile(r'(private|protected|public)?\s(int|float|String|boolean|double)\s*\w+\s*(=|;)')
    godClass=0       
    for m in re.finditer(pattern, content):
        m.start()
        godClass +=1

    if godClass > 7:
        return '1'
    else:
        return '0'

#Rule 2 - Data Class
@app.route('/api/dataClass', methods=['GET']) 
def DataClass():
    with open('source.txt', 'r') as file:
        content = file.read()

    pattern = re.compile(r'[public]\s(int|float|String|boolean|double|void)\s*\w+\s*[(]\s*\w*[\s*)\s*{]')
    dataClass = []       
    for m in re.finditer(pattern, content):
	    start = m.start()
	    dataClass.append(content.count('\n', 0, start) + 1)
    
    if len(dataClass) == 0:
        return '0'
    else:
        return '1'

#Rule 3 - Long Method
@app.route('/api/longMethod', methods=['GET']) 
def LongMethod():
    with open('source.txt', 'r') as file:
        content = file.read()

    pattern = re.compile(r'[public]\s(int|float|String|boolean|double|void)\s\w+\s*[(]\s?\w*[\s?)\s*{]\w')
    dataClass = []       
    for m in re.finditer(pattern, content):
	    start = m.start()
	    dataClass.append(content.count('\n', 0, start) + 1)
    
    if len(dataClass) == 0:
        return '0'
    else:
        return '1'

#Rule 6 - Class Members should be private
@app.route('/api/privateClassMembers', methods=['GET']) 
def PrivateClassMembers():
    with open('source.txt', 'r') as file:
        content = file.read()

    pattern = re.compile(r'[public]\s*(int|float|String|boolean|double)\s*\w+\s*(;|=)')
    lines = []       
    for m in re.finditer(pattern, content):
	    start = m.start()
	    lines.append(content.count('\n', 0, start) + 1)

    if len(lines) == 0:
        return '0'
    else:
        return str(lines)

#Rule 7 - Ordering class members by order
@app.route('/api/orderClassMembers', methods=['GET']) 
def OrderClassMembers():
    with open('source.txt', 'r') as file:
        content = file.read()
    
    pattern = re.compile(r'(private|protected|public)?\s*(int|float|String|boolean|double)\s*\w+\s?(=|;)')
    result = []

    for m in re.finditer(pattern, content):
        value = re.split('\n| ',m.group(0))
        if(value[0] == ''):
            result.append(2)
        else:
            if(value[0] == "private"):
                result.append(1)
            elif(value[0] == "protected"):
                result.append(3)
            elif (value[0] == "public"):
                result.append(4)

    if len(result)==0:
        return '0'

    list2 = sorted(result)

    if functools.reduce(lambda i, j : i and j, map(lambda m, k: m == k, result, list2), True) : 
        return 's'
    else :
        return 'ns'

#Rule 8 - Empty catch blocks
@app.route('/api/emptyCatch', methods=['GET']) 
def emptyCatchBlock():
    with open('source.txt', 'r') as file:
        content = file.read()

    pattern = re.compile(r'(catch\s*\([^\)]*\)\s*\{((/\*(.|[\r\n])*?\*/)|\s)*\})')
    emptyCatch = []       
    for m in re.finditer(pattern, content):
	    start = m.start()
	    emptyCatch.append(content.count('\n', 0, start) + 1)
	    # offset = start - content.rfind('\n', 0, start)
	    # word = m.group(1)
 
    if len(emptyCatch) == 0:
        return '0'
    else:
        return str(emptyCatch)

#Rule 9 - Redundant Initialization
@app.route('/api/redundentIntialization', methods=['GET']) 
def redundentIntialization():
    with open('source.txt', 'r') as file:
        content = file.read()
    
    RIPattern = re.compile(r'(int|float|String|boolean|double)\s*\w+\s?[=]\s*(0|null|false)[;]')
    RIList = []
   
    for m in re.finditer(RIPattern, content):
	    start = m.start()
	    RIList.append(content.count('\n', 0, start) + 1)

    if len(RIList) == 0:
        return '0'
    else:
        return str(RIList)

#Rule 10 - For Loops with indexes
@app.route('/api/forLoop', methods=['GET']) 
def ForLoop():
    with open('source.txt', 'r') as file:
        content = file.read()
 
    forPattern = re.compile(r'(for\s*\([\w*\s[a-zA-Z]{1}\s=\s0]*?;[^;]*?;[^)]*?\))')
    forList = []
    for m in re.finditer(forPattern, content):
	    start = m.start()
	    forList.append(content.count('\n', 0, start) + 1)

    if len(forList) == 0:
        return '0'
    else:
        return str(forList)

# if __name__ == '__main__':
#     OrderClassMembers()