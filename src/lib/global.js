const {
    tfGraph
} = require('./graph.js');

let graph = new tfGraph();

let editorText =
    `# complete these function for data loading and pre processing.
# Do not change the names of any of these functions
# However you are free to define any number of your defined functions

X = None
Y = None

def getTrainingDataX():
    # create or load your data here
    return X

def getTrainingDataY():
    # create or load your data here
    return Y
`

let extraText =
    `
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

`

let modelText = "";

let layer = new Konva.Layer();
graph.modelLayers.push(layer)


let layerParameters = {
    Dense: {
        units: 1,
        activation: "None",
        use_bias: "True",
        kernel_initializer: "'glorot_uniform'",
        bias_initializer: "'zeros'",
        kernel_regularizer: "None",
        bias_regularizer: "None",
        activity_regularizer: "None",
        kernel_constraint: "None",
        bias_constraint: "None",
    },
    Conv2D: {
        filters: 1,
        kernel_size: "(3, 3)",
        strides: "(1, 1)",
        padding: "'valid'",
        data_format: "None",
        dilation_rate: "(1, 1)",
        activation: "None",
        use_bias: "True",
        kernel_initializer: "'glorot_uniform'",
        bias_initializer: "'zeros'",
        kernel_regularizer: "None",
        bias_regularizer: "None",
        activity_regularizer: "None",
        kernel_constraint: "None",
        bias_constraint: "None",
    },
    MaxPool2D: {
        pool_size: "(2, 2)",
        strides: "None",
        padding: "'valid'",
        data_format: "None",
    },
    Activation: {
        activation: "'linear'"
    },
    Dropout: {
        rate: 0.1,
        noise_shape: "None",
        seed: "None",
    },
    InputLayer: {
        shape : "None",
        batch_size : "None",
        name : "None",
        dtype : "None",
        sparse : "False",
        tensor : "None",
    },
    Output: {

    },
    Flatten:{}
}

module.exports = {
    editorText: editorText,
    modelText: modelText,
    extraText: extraText,
    graph: graph,
    layerParameters: layerParameters
}