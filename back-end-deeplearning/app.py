from flask import Flask, render_template, request
from werkzeug.utils import secure_filename

import os
from PIL import Image

import fastbook
import torch
from fastbook import *

import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__, static_folder='')

#업로드 HTML 렌더링
@app.route('/upload')
def render_file():
   return render_template('upload.html')

#파일 업로드 처리
@app.route('/fileUpload', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      #저장할 경로 + 파일명
      f.save(secure_filename(f.filename))

      learner = load_learner('./plantrowth_resnet50_train.pkl')
      print('model loaded!')

      os.remove('static/test.jpg')
      img = Image.open(f.filename)
      img_resize = img.resize((224, 224))
      img_resize.save('test.jpg')

      answer = learner.predict('./test.jpg')
      list2 = list(answer)
      print(list2)
      #print(answer)
      #print(type(answer))

      return render_template('answer.html', image_file='static/test.jpg', list=list2[0])
      #return 'uploads 디렉토리 -> 파일 업로드 성공!'

if __name__ == '__main__':
    #서버 실행
   app.run(debug = True)
