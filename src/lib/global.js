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

let modelText =
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
        print("mean_absolute_error=", logs.get('mean_absolute_error'), flush=True)
        print("acc=", logs.get('acc'), flush=True)
        # with open('./testing/data.csv', 'a+') as writeFile:
        #     writer = csv.writer(writeFile)
        #     writer.writerows([[epoch, logs.get('loss'), logs.get('mean_absolute_error')]])

`

let layer = new Konva.Layer();
graph.modelLayers.push(layer)


module.exports = {
    editorText: editorText,
    modelText: modelText,
    graph: graph
}