import os
from PIL import Image

import fastbook
from fastbook import *

import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

learner = load_learner('./plantrowth_resnet50_train.pkl')
print('model loaded!')

os.remove('test.jpg')
img = Image.open('./picture8_224x224.jpg')
img_resize = img.resize((224, 224))
img_resize.save('test.jpg')

answer = learner.predict('./test.jpg')
print(answer)