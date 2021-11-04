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

app = Flask(__name__)

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

      first_learner = load_learner('./plantrowth_first_resnet50_train.pkl')
      second_learner = load_learner('./plantrowth_second_resnet50_train.pkl')
      print('first model loaded!')
      print('second model loaded!')

      os.remove('test.jpg')
      img = Image.open(f.filename)
      img_resize = img.resize((224, 224))
      img_resize_2 = img.resize((512, 512))
      img_resize.save('test.jpg')

      os.remove('test2.jpg')
      img_resize_2.save('test2.jpg')

      answer_1 = first_learner.predict('./test.jpg')
      answer_2 = second_learner.predict('./test2.jpg')
      list_1 = list(answer_1)
      list_2 = list(answer_2)
      print(list_1)
      print(list_2)

      value = list_1[1]
      value2 = list_2[1]

      print(list_1[2][value] * 100)

      return render_template('answer.html', first=list_1[0], second=list_2[0], value2=list_1[2][value] * 100, value1=list_2[2][value2] * 100)

if __name__ == '__main__':
    #서버 실행
   app.run(debug = True)
