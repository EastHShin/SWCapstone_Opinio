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


# 업로드 HTML 렌더링
@app.route('/api/plants/diagnosis')
def render_file():
    return render_template('upload.html')


# 파일 업로드 처리
@app.route('/dignosiserver/answer', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        # 저장할 경로 + 파일명
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

        val1Mild = list_1[2][5] + list_1[2][7] + list_1[2][25] + list_1[2][31] + list_1[2][16] * 0.6 + \
                   list_1[2][18] * 0.6 + list_1[2][28] * 0.6 + list_1[2][32] * 0.6 + list_1[2][34] * 0.6

        val1Severe = list_1[2][0] + list_1[2][1] + list_1[2][2] + list_1[2][8] + list_1[2][11] + list_1[2][12] + \
                     list_1[2][15] + list_1[2][16] * 0.4 + list_1[2][18] * 0.4 + list_1[2][28] * 0.4 + \
                     list_1[2][32] * 0.4 + list_1[2][34] * 0.4

        val1Blight = list_1[2][9] + list_1[2][13] + list_1[2][20] + list_1[2][21] + list_1[2][29] + list_1[2][30]

        val1Healthy = list_1[2][3] + list_1[2][4] + list_1[2][6] + list_1[2][10] + list_1[2][14] + list_1[2][17] + \
                      list_1[2][19] + list_1[2][22] + list_1[2][23] + list_1[2][24] + list_1[2][27] + list_1[2][37]

        val1Parasite = list_1[2][33]

        val1Virus = list_1[2][26] + list_1[2][35] + list_1[2][37]

        val2Mild = list_2[2][1] + list_2[2][2] * 0.6 + list_2[2][4] + list_2[2][5] * 0.6 + \
                   list_2[2][9] * 0.35 + list_2[2][10] * 0.2 + list_2[2][11] * 0.1

        val2Severe = list_2[2][6] + list_2[2][7] * 0.7 + list_2[2][8] + list_2[2][9] * 0.65 + \
                     list_2[2][10] * 0.8 + list_2[2][11] * 0.5

        val2Complex = list_2[2][0] + list_2[2][2] * 0.4 + list_2[2][5] * 0.4 + list_2[2][7] * 0.3 + list_2[2][11] * 0.4

        val2Healthy = list_2[2][3]

        print("Value for Dataset 1")
        print(round(float(val1Mild) * 100, 8))
        print(round(float(val1Severe) * 100, 8))
        print(round(float(val1Blight) * 100, 8))
        print(round(float(val1Healthy) * 100, 8))
        print(round(float(val1Parasite) * 100, 8))
        print(round(float(val1Virus) * 100, 8))

        print("Value for Dataset 2")
        print(round(float(val2Mild) * 100, 8))
        print(round(float(val2Severe) * 100, 8))
        print(round(float(val2Complex) * 100, 8))
        print(round(float(val2Healthy) * 100, 8))

        val1Mild = round(float(val1Mild) * 100, 8)
        val1Severe = round(float(val1Severe) * 100, 8)
        val1Blight = round(float(val1Blight) * 100, 8)
        val1Healthy = round(float(val1Healthy) * 100, 8)
        val1Parasite = round(float(val1Parasite) * 100, 8)
        val1Virus = round(float(val1Virus) * 100, 8)

        val2Mild = round(float(val2Mild) * 100, 8)
        val2Severe = round(float(val2Severe) * 100, 8)
        val2Complex = round(float(val2Complex) * 100, 8)
        val2Healthy = round(float(val2Healthy) * 100, 8)

        value = list_1[1]
        value2 = list_2[1]

        print(list_1[2][value] * 100)

        return render_template('answer.html', first=list_1[0], second=list_2[0], value2=list_1[2][value] * 100,
                               value1=list_2[2][value2] * 100, val2Mild=val2Mild, val2Severe=val2Severe,
                               val2Complex=val2Complex, val2Healthy=val2Healthy,
                               val1Mild=val1Mild, val1Severe=val1Severe, val1Blight=val1Blight,
                               val1Healthy=val1Healthy, val1Parasite=val1Parasite, val1Virus=val1Virus)


if __name__ == '__main__':
    # 서버 실행
    app.run(debug=True)
