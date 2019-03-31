
# importing libraries
from tensorflow.keras.callbacks import Callback, RemoteMonitor

# model callback
class LossAcc(Callback):
    def __init__(self):
        super().__init__()

    def on_epoch_end(self, epoch, logs={}):
        print("epoch=", epoch, flush=True)
        print("loss=", logs.get('loss'), flush=True)
        print("acc=", logs.get('acc'), flush=True)

import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model, load_model
import numpy as np

'''
complete getTrainingDat function for data loading and pre processing.
Do not change the name of the function
'''
def getTrainingData():
    X = np.random.rand(10000, 2)*100
    X = X.astype('int')
    Y = np.sum(X, axis=1)
    return X,Y


# Generated Model
def Network():
    InputLayer_1 = Input(shape = None,batch_size = None,name = None,dtype = None,sparse = False,tensor = None,)
    Dense_1 = Dense(units = 1,activation = None,use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(InputLayer_1)
    model = Model(inputs=InputLayer_1, outputs=Dense_1)
    optimizer = tf.keras.optimizers.Adam(lr=0.0001)
    model.compile(optimizer = optimizer, loss='mean_squared_error' ,metrics=['mae','accuracy'])
    return model

# function for training model
def train():
    model = Network()
    x,y = getTrainingData()
    model.fit(x = x, y = y, epochs=30, batch_size=10, callbacks=[LossAcc()], verbose=0)

# code execution starts here
if __name__== "__main__":
    train()
