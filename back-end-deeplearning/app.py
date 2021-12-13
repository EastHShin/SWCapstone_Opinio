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


@app.route('/check', methods=['GET', 'POST'])
def check_image():
    text = request.json
    url = text['file_name']
    print(url)
    urllib.request.urlretrieve(url, "temp.png")
    img_c = Image.open("temp.png")
    rgb_img = img_c.convert('RGB')
    rgb_img.save("temp.jpg")

    plant_learner = load_learner('./plant_notplant_resnet18.pkl')
    print('check model loaded!')
    img = Image.open("temp.jpg")
    pt_resize = img.resize((256, 256))
    pt_resize.save('plant_check_test.jpg')

    ck_answer = plant_learner.predict('./plant_check_test.jpg')
    list_ck = list(ck_answer)

    is_plant = ""
    is_percent = 0
    value_ck = list_ck[1]

    if value_ck == 0:
        is_plant = "NO"
        is_percent = list_ck[2][0]
    else:
        is_plant = "YES"
        is_percent = list_ck[2][1]

    answer = OrderedDict()
    answer["is_plant"] = is_plant
    answer["is_percentage"] = float(is_percent * 100)

    return (json.dumps(answer, indent="\t", ensure_ascii=False))


# 파일 업로드 처리
@app.route('/predict', methods=['GET', 'POST'])
def infer_image():
    text = request.json
    url = text['file_name']
    print(url)
    urllib.request.urlretrieve(url, "temp.png")
    img_c = Image.open("temp.png")
    rgb_img = img_c.convert('RGB')
    rgb_img.save("temp.jpg")

    first_learner = load_learner('./plantrowth_first_resnet50_train.pkl')
    #second_learner = load_learner('./plantrowth_second_resnet50_train.pkl')
    print('model loaded!')
    #print('second model loaded!')

    img = Image.open("temp.jpg")
    img_resize = img.resize((224, 224))
    #img_resize_2 = img.resize((512, 512))
    img_resize.save('first_test.jpg')
    #img_resize_2.save('test2.jpg')

    answer_1 = first_learner.predict('./first_test.jpg')
    #answer_2 = second_learner.predict('./test2.jpg')
    list_1 = list(answer_1)

    disease_name = "건강한"
    value = list_1[2][3] + list_1[2][4] + list_1[2][6] + list_1[2][10] + list_1[2][14] + list_1[2][17] + \
            list_1[2][19] + list_1[2][22] + list_1[2][23] + list_1[2][24] + list_1[2][27] + list_1[2][37]

    if value < list_1[2][0]:
        value = list_1[2][0]
        disease_name = "붉은 곰팡이 병"

    if value < list_1[2][1] + list_1[2][11]:
        value = list_1[2][1] + list_1[2][11]
        disease_name = "흑균병"

    if value < list_1[2][2] + list_1[2][8]:
        value = list_1[2][2] + list_1[2][8]
        disease_name = "녹병"

    if value < list_1[2][5] + list_1[2][25]:
        value = list_1[2][5] + list_1[2][25]
        disease_name = "흰가루병"

    if value < list_1[2][7] + list_1[2][16] + list_1[2][18] + list_1[2][28] + list_1[2][32] + list_1[2][34]:
        value = list_1[2][7] + list_1[2][16] + list_1[2][18] + list_1[2][28] + list_1[2][32] + list_1[2][34]
        disease_name = "무늬병"

    if value < list_1[2][9] + list_1[2][13] + list_1[2][20] + list_1[2][21] + list_1[2][29] + list_1[2][30]:
        value = list_1[2][9] + list_1[2][13] + list_1[2][20] + list_1[2][21] + list_1[2][29] + list_1[2][30]
        disease_name = "잎마름병"

    if value < list_1[2][12]:
        value = list_1[2][12]
        disease_name = "갈반병"

    if value < list_1[2][15]:
        value = list_1[2][15]
        disease_name = "(감귤)녹화병"

    if value < list_1[2][26]:
        value = list_1[2][26]
        disease_name = "잎가마름병"

    if value < list_1[2][31]:
        value = list_1[2][31]
        disease_name = "잎곰팡이병"

    if value < list_1[2][33]:
        value = list_1[2][33]
        disease_name = "잎응애"

    if value < list_1[2][35] + list_1[2][36]:
        value = list_1[2][35] + list_1[2][36]
        disease_name = "바이러스"

    print(list_1)
    answer = OrderedDict()
    answer["disease_model_1"] = disease_name
    answer["percent_model_1"] = float(value * 100)
    print(answer)

    return (json.dumps(answer, indent="\t", ensure_ascii=False))


if __name__ == '__main__':
    # 서버 실행
    app.run(debug=True)
