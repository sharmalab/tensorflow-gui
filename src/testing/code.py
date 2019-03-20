# complete these function for data loading and pre processing.
# Do not change the names of any of these functions
# However you are free to define any number of your defined functions

import numpy as np

X = np.random.rand(10000, 2)*1000
X = np.array(X, dtype=np.int32)
Y = np.sum(X, axis=1)

def getTrainingDataX():
    # create or load your data here
    return X

def getTrainingDataY():
    # create or load your data here
    return Y


# importing libraries
import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.callbacks import Callback, RemoteMonitor
import csv

class LossAcc(Callback):
    def __init__(self):
        super().__init__()

    def on_epoch_end(self, epoch, logs={}):
        print("epoch=", epoch, flush=True)
        print("loss=", logs.get('loss'), flush=True)
        print("mean_absolute_error=", logs.get('mean_absolute_error'), flush=True)
        print("acc=", logs.get('acc'), flush=True)
        # with open('./testing/data.csv', 'a+') as writeFile:
        #     writer = csv.writer(writeFile)
        #     writer.writerows([[epoch, logs.get('loss'), logs.get('mean_absolute_error')]])

def Network():
    Input1 = Input(shape=(2,))
    Dense1 = Dense(4, activation="linear")(Input1)
    Dense2 = Dense(4, activation="linear")(Dense1)
    Dense3 = Dense(1)(Dense2)
    model = Model(inputs=Input1, outputs=Dense3)
    optimizer = tf.keras.optimizers.Adam(lr=0.0001)
    model.compile(optimizer = optimizer, loss='mean_squared_error' ,metrics=['mae', 'accuracy'])
    return model

def train():
    model = Network()
    # model.summary()
    model.fit(x = getTrainingDataX(), y = getTrainingDataY(), epochs=10, batch_size=10, callbacks=[LossAcc()], verbose=0)

train()
    