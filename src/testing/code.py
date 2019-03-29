# complete these function for data loading and pre processing.
# Do not change the names of any of these functions
# However you are free to define any number of your defined functions

from tensorflow import keras
from tensorflow.keras.datasets import mnist

(x_train, y_train), (x_test, y_test) = mnist.load_data()

x_train = x_train.reshape(x_train.shape[0], 28, 28, 1)
x_train = x_train.astype('float32')/255
y_train = keras.utils.to_categorical(y_train, 10)

def getTrainingDataX():
    # create or load your data here
    return x_train

def getTrainingDataY():
    # create or load your data here
    return y_train



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
        # print("mean_absolute_error=", logs.get('mean_absolute_error'), flush=True)
        print("acc=", logs.get('acc'), flush=True)
        # with open('./testing/data.csv', 'a+') as writeFile:
        #     writer = csv.writer(writeFile)
        #     writer.writerows([[epoch, logs.get('loss'), logs.get('mean_absolute_error')]])


def Network():
    InputLayer1 = Input(shape = (28,28,1),batch_size = None,name = None,dtype = None,sparse = False,tensor = None,)
    Conv2D1 = Conv2D(filters = 32,kernel_size = (3, 3),strides = (1, 1),padding = 'valid',data_format = None,dilation_rate = (1, 1),activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(InputLayer1)
    Conv2D2 = Conv2D(filters = 64,kernel_size = (3, 3),strides = (1, 1),padding = 'valid',data_format = None,dilation_rate = (1, 1),activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(Conv2D1)
    MaxPool2D1 = MaxPool2D(pool_size = (2, 2),strides = None,padding = 'valid',data_format = None,)(Conv2D2)
    Flatten1 = Flatten()(MaxPool2D1)
    Dropout1 = Dropout(rate = 0.25,noise_shape = None,seed = None,)(Flatten1)
    Dense1 = Dense(units = 128,activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(Dropout1)
    Dropout2 = Dropout(rate = 0.5,noise_shape = None,seed = None,)(Dense1)
    Dense2 = Dense(units = 10,activation = 'softmax',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(Dropout2)
    model = Model(inputs=InputLayer1, outputs=Dense2)
    optimizer = tf.keras.optimizers.Adam(lr=0.0001)
    model.compile(optimizer = optimizer, loss='categorical_crossentropy' ,metrics=['mae','accuracy'])
    return model

def train():
    model = Network()
    # model.summary()
    model.fit(x = getTrainingDataX(), y = getTrainingDataY(), epochs=10, batch_size=128, callbacks=[LossAcc()], verbose=0)

train()
    