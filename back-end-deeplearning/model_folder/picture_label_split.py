import pandas as pd
import shutil
import os
from shutil import move

from_folder = "X:\Split\img_sz_640"
to_folder_base = "X:\Split\images"

csvfile = pd.read_csv('./train.csv')
r, c = csvfile.shape

for index in range(r):
    print(index)
    img_name = csvfile['image'][index]
    keyword = csvfile['labels'][index]

    to_folder = os.path.join(to_folder_base, keyword)
    os.makedirs(to_folder, exist_ok=True)
    old_img_path = os.path.join(from_folder, img_name)
    new_img_path = os.path.join(to_folder, img_name)
    move(old_img_path, new_img_path)
