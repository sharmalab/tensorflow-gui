
# importing libraries
from tensorflow.keras.callbacks import Callback, RemoteMonitor, TensorBoard
import tensorflow as tf
from time import time
tensorboard = TensorBoard(log_dir="testing/logs/{}".format(time()), histogram_freq=0,write_graph=True,write_grads=True,write_images=True)


def parse(serialized):
    features = {
            'image': tf.FixedLenFeature([], tf.string),
            'label': tf.FixedLenFeature([], tf.int64)
        }

    parsed_example = tf.parse_single_example(serialized=serialized, features=features)
    image_raw = parsed_example['image']
    image = tf.image.decode_image(image_raw,channels=3)

    #image = tf.decode_raw(image_raw, tf.uint8)
    image = tf.cast(image, tf.float32)
    label = parsed_example['label']
    return image, label

def LoadImageRecord(record_filepath, image_size=() , batch_size=64, shuffle=True, buffer_size=512, num_repeat=1, one_hot_labels=True, num_classes = 10):
    dataset = tf.data.TFRecordDataset(filenames=record_filepath)
    dataset = dataset.map(parse)
    import numpy as np

    if shuffle:
        # If training then read a buffer of the given size and
        # randomly shuffle it.
        dataset = dataset.shuffle(buffer_size=buffer_size)

    # Repeat the dataset the given number of times.
    dataset = dataset.repeat(num_repeat)

    # Get a batch of data with the given size.
    dataset = dataset.batch(batch_size)

    # Create an iterator for the dataset and the above modifications.
    iterator = dataset.make_one_shot_iterator()

    # Get the next batch of images and labels.
    images_batch, labels_batch = iterator.get_next()

    images_batch = tf.reshape(images_batch, [-1, *image_size])

    if(one_hot_labels):
        labels_batch = tf.one_hot(labels_batch, num_classes)

    return images_batch, labels_batch

def _int64_feature(value):
    return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))

def _bytes_feature(value):
    return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

def CreateImageRecord(savefilename, images, labels, images_string=True):
    # open the TFRecords file
    writer = tf.python_io.TFRecordWriter(savefilename)
    for i in range(len(images)):
        img = images[i]
        label = labels[i]

        # Create a feature
        if images_string:
            feature = {
                'image': _bytes_feature(img),
                'label': _int64_feature(label)
            }
        else:
            feature = {
                'image': _bytes_feature(img.tostring()),
                'label': _int64_feature(label)
            }
        
        # Create an example protocol buffer
        example = tf.train.Example(features=tf.train.Features(feature=feature))
        
        # Serialize to string and write on the file
        writer.write(example.SerializeToString())
    writer.close()


from natsort import natsorted
import glob
def LoadImageFolder(filepath_regex, gray=True, asbytes=False):
    imgids = []
    images = []
    for img in glob.glob(filepath_regex):
        imgids.append(img)

    imgids = natsorted(imgids)

    print(imgids[:5])

    for img_path in imgids:
        if asbytes:
            with tf.gfile.FastGFile(img_path, 'rb') as fid:
                img = fid.read()
        else:
            import cv2
            img = cv2.imread(img_path)
            if gray:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        images.append(img)
    
    return images, imgids


import pandas as pd
import numpy as np
def LoadCSV(filepath):
    data = np.array(pd.read_csv(filepath))
    cols = data.T
    rows = data
    return rows, cols

import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model, load_model

'''
complete getTrainingDat function for data loading and pre processing.
Do not change the name of the function
'''
def getTrainingData():
    X = None
    Y = None    
    return X,Y


# Called Functions
rows,cols, = LoadCSV(filepath = 'testing/labels.csv',)
images,image_names, = LoadImageFolder(filepath_regex = 'testing/*/*.jpg',gray = True,asbytes = True,)
CreateImageRecord(savefilename = 'testing/record.tf',images = images,labels = cols[1],)
X,Y, = LoadImageRecord(record_filepath = 'testing/record.tf',image_size = (28,28,3),batch_size = 128,shuffle = True,buffer_size = 1024,num_repeat = 100,one_hot_labels = True,num_classes = 10,)

tf.summary.image('input_data', X)
tf.summary.merge_all()

# Generated Model

def Network():
    InputLayer_1 = Input(shape = None,batch_size = None,name = None,dtype = None,sparse = False,tensor = X,)
    Conv2D_1 = Conv2D(filters = 32,kernel_size = (3, 3),strides = (1, 1),padding = 'valid',data_format = None,dilation_rate = (1, 1),activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(InputLayer_1)
    Flatten_1 = Flatten()(Conv2D_1)
    Dropout_1 = Dropout(rate = 0.25,noise_shape = None,seed = None,)(Flatten_1)
    Dense_1 = Dense(units = 128,activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(Dropout_1)
    Dense_2 = Dense(units = 10,activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(Dense_1)
    model = Model(inputs=InputLayer_1, outputs=Dense_2)
    optimizer = tf.keras.optimizers.SGD(lr=0.001, momentum=0.0, decay=0.0,)
    model = Model(inputs=InputLayer_1, outputs=Dense_2)
    model.compile(metrics=['mae','accuracy', 'mse', 'mape', 'cosine', 'categorical_crossentropy'], optimizer=optimizer , loss = 'categorical_crossentropy',loss_weights = None,sample_weight_mode = None,weighted_metrics = None,target_tensors = [Y],)
    return model


# function for training model
def train():
    model = Network()
    x,y = getTrainingData()
    model.fit(x = None,y = None,batch_size = None,epochs = 20,verbose = 0,callbacks = [tensorboard],validation_split = 0,validation_data = None,shuffle = True,class_weight = None,sample_weight = None,initial_epoch = 0,steps_per_epoch = 42000//128,validation_steps = None,)

train()
