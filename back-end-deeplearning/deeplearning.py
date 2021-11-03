import os
from PIL import Image

import fastbook
from fastbook import *

import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath


def get_x(x): return x['image']
def get_y(y): return y['labels']


learner = load_learner('./plantrowth_second_resnet50_train.pkl')
print('model loaded!')

#img = Image.open('./aaaaa.jpg')
#img_resize = img.resize((512, 512))
#img_resize.save('test.jpg')

answer = learner.predict('./test2.jpg')
print(answer)