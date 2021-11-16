from fastai.learner import load_learner
from flask import Flask, request
from PIL import Image
from collections import OrderedDict
import urllib.request
import pathlib
import os
import json

temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


# 파일 업로드 처리
@app.route('/predict', methods=['GET', 'POST'])
def infer_image():
    text = request.json
    url = text['link']
    print(url)
    urllib.request.urlretrieve(url, "temp.jpg")

    first_learner = load_learner('./plantrowth_first_resnet50_train.pkl')
    second_learner = load_learner('./plantrowth_second_resnet50_train.pkl')
    print('first model loaded!')
    print('second model loaded!')

    os.remove('test.jpg')
    os.remove('test2.jpg')

    img = Image.open("temp.jpg")
    img_resize = img.resize((224, 224))
    img_resize_2 = img.resize((512, 512))
    img_resize.save('test.jpg')
    img_resize_2.save('test2.jpg')

    answer_1 = first_learner.predict('./test.jpg')
    answer_2 = second_learner.predict('./test2.jpg')
    list_1 = list(answer_1)
    list_2 = list(answer_2)

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

    answer = OrderedDict()
    answer["disease_model_1"] = list_1[0]
    answer["disease_model_2"] = list_2[0]
    answer["percent_model_1"] = float(list_1[2][value] * 100)
    answer["percent_model_2"] = float(list_2[2][value2] * 100)
    answer["model_1_Healthy"] = val1Healthy
    answer["model_1_Mild"] = val1Mild
    answer["model_1_Severe"] = val1Severe
    answer["Blight"] = val1Blight
    answer["Parasite"] = val1Parasite
    answer["Virus"] = val1Virus
    answer["model_2_Healthy"] = val2Healthy
    answer["model_2_Mild"] = val2Mild
    answer["model_2_Complex"] = val2Complex
    answer["model_2_Severe"] = val2Severe

    print(answer)
    return (json.dumps(answer, indent="\t"))


if __name__ == '__main__':
    # 서버 실행
    app.run(debug=True)
