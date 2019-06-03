
# importing libraries
import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.callbacks import Callback, RemoteMonitor, TensorBoard
import tensorflow as tf
from time import asctime

logs_path = "testing/Projects/hello_world/logs/{}".format(asctime())

tensorboard = TensorBoard(log_dir=logs_path, histogram_freq=0,write_graph=True,write_grads=True,write_images=True)




# Called Functions
import numpy as np
def getTrainingData():
    x = np.random.randint(1000,size=(10000,2))
    y = np.sum(x,axis=1,dtype=np.float)
    return x,y

# Generated Model

def Network():
    InputLayer_1 = Input(shape = (2,),batch_size = 40,name = None,dtype = tf.float32,sparse = False,tensor = None,)
    Dense_1 = Dense(units = 8,activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(InputLayer_1)
    Dense_2 = Dense(units = 1,activation = 'relu',use_bias = True,kernel_initializer = 'glorot_uniform',bias_initializer = 'zeros',kernel_regularizer = None,bias_regularizer = None,activity_regularizer = None,kernel_constraint = None,bias_constraint = None,)(Dense_1)
    model = Model(inputs=InputLayer_1, outputs=Dense_2)
    optimizer = tf.keras.optimizers.SGD(lr=0.001, momentum=0.0, decay=0.0,)
    model = Model(inputs=InputLayer_1, outputs=Dense_2)
    model.compile(metrics=['mae','accuracy', 'mse', 'mape', 'cosine', 'categorical_crossentropy'], optimizer=optimizer , loss = 'mean_squared_error',loss_weights = None,sample_weight_mode = None,weighted_metrics = None,target_tensors = None,)
    return model


# function for training model
def train():
    model = Network()
    x,y = getTrainingData()
    model.fit(x = x,y = y,batch_size = 40,epochs = 40,verbose = 0,callbacks = [tensorboard],validation_split = 0,validation_data = None,shuffle = True,class_weight = None,sample_weight = None,initial_epoch = 0,steps_per_epoch = None,validation_steps = None,)


train()

