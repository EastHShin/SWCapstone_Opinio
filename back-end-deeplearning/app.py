from flask import Flask, render_template, request
from werkzeug.utils import secure_filename

import os
from PIL import Image

import fastbook
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

      learner = load_learner('./plantrowth_resnet50_train.pkl')
      print('model loaded!')

      os.remove('test.jpg')
      img = Image.open(f.filename)
      img_resize = img.resize((224, 224))
      img_resize.save('test.jpg')

      answer = learner.predict('./test.jpg')
      print(answer)

      
      #return 'uploads 디렉토리 -> 파일 업로드 성공!'

if __name__ == '__main__':
    #서버 실행
   app.run(debug = True)
