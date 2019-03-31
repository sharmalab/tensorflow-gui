const {
    tfGraph
} = require('./graph.js');

let graph = new tfGraph();

let editorText =
    `
'''
complete getTrainingDat function for data loading and pre processing.
Do not change the name of the function
'''
def getTrainingData():
    X = None
    Y = None    
    return X,Y

`

let extraText =
    `
# importing libraries
import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.callbacks import Callback, RemoteMonitor

# model callback
class LossAcc(Callback):
    def __init__(self):
        super().__init__()

    def on_epoch_end(self, epoch, logs={}):
        print("epoch=", epoch, flush=True)
        print("loss=", logs.get('loss'), flush=True)
        print("acc=", logs.get('acc'), flush=True)
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
        shape: "None",
        batch_size: "None",
        name: "None",
        dtype: "None",
        sparse: "False",
        tensor: "None",
    },
    Output: {},
    Flatten: {},
    Add: {},
    AveragePooling1D: {
        pool_size: 2,
        strides: "None",
        padding: "'valid'",
        data_format: "'channels_last'",
    },
    AveragePooling2D: {
        pool_size: "(2,2)",
        strides: "None",
        padding: "'valid'",
        data_format: "None",
    },
    AveragePooling3D: {
        pool_size: "(2,2,2)",
        strides: "None",
        padding: "'valid'",
        data_format: "None",
    },
    Bidirectional: {
        merge_mode: "'concat'",
        weights: "None",
    },
    Concatenate: {
        axis: 1
    },
    Conv1D: {
        filters: 1,
        kernel_size: 2,
        strides: 1,
        padding: "'valid'",
        data_format: "'channels_last'",
        dilation_rate: 1,
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
    Conv3D: {
        filters: 1,
        kernel_size: "(1, 1, 1)",
        strides: "(1, 1, 1)",
        padding: "'valid'",
        data_format: "None",
        dilation_rate: "(1, 1, 1)",
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
    ConvLSTM2D: {
        filters: 1,
        kernel_size: "(1, 1)",
        strides: "(1, 1)",
        padding: "'valid'",
        data_format: "None",
        dilation_rate: "(1, 1)",
        activation: "'tanh'",
        recurrent_activation: "'hard_sigmoid'",
        use_bias: "True",
        kernel_initializer: "'glorot_uniform'",
        recurrent_initializer: "'orthogonal'",
        bias_initializer: "'zeros'",
        unit_forget_bias: "True",
        kernel_regularizer: "None",
        recurrent_regularizer: "None",
        bias_regularizer: "None",
        activity_regularizer: "None",
        kernel_constraint: "None",
        recurrent_constraint: "None",
        bias_constraint: "None",
        return_sequences: "False",
        go_backwards: "False",
        stateful: "False",
        dropout: 0.0,
        recurrent_dropout: 0.0,
    },
    CuDNNGRU: {
        units: 1,
        kernel_initializer: "'glorot_uniform'",
        recurrent_initializer: "'orthogonal'",
        bias_initializer: "'zeros'",
        kernel_regularizer: "None",
        recurrent_regularizer: "None",
        bias_regularizer: "None",
        activity_regularizer: "None",
        kernel_constraint: "None",
        recurrent_constraint: "None",
        bias_constraint: "None",
        return_sequences: "False",
        return_state: "False",
        go_backwards: "False",
        stateful: "False",
    },
    CuDNNLSTM: {
        units: 1,
        kernel_initializer: "'glorot_uniform'",
        recurrent_initializer: "'orthogonal'",
        bias_initializer: "'zeros'",
        unit_forget_bias: "True",
        kernel_regularizer: "None",
        recurrent_regularizer: "None",
        bias_regularizer: "None",
        activity_regularizer: "None",
        kernel_constraint: "None",
        recurrent_constraint: "None",
        bias_constraint: "None",
        return_sequences: "False",
        return_state: "False",
        go_backwards: "False",
        stateful: "False",
    },
    GRU: {
        units: 1,
        activation: "'tanh'",
        recurrent_activation: "'hard_sigmoid'",
        use_bias: "True",
        kernel_initializer: "'glorot_uniform'",
        recurrent_initializer: "'orthogonal'",
        bias_initializer: "'zeros'",
        kernel_regularizer: "None",
        recurrent_regularizer: "None",
        bias_regularizer: "None",
        activity_regularizer: "None",
        kernel_constraint: "None",
        recurrent_constraint: "None",
        bias_constraint: "None",
        dropout: 0.0,
        recurrent_dropout: 0.0,
        implementation: 1,
        return_sequences: "False",
        return_state: "False",
        go_backwards: "False",
        stateful: "False",
        unroll: "False",
        reset_after: "False",
    },
    LSTM: {
        units: 1,
        activation: "'tanh'",
        recurrent_activation: "'hard_sigmoid'",
        use_bias: "True",
        kernel_initializer: "'glorot_uniform'",
        recurrent_initializer: "'orthogonal'",
        bias_initializer: "'zeros'",
        unit_forget_bias: "True",
        kernel_regularizer: "None",
        recurrent_regularizer: "None",
        bias_regularizer: "None",
        activity_regularizer: "None",
        kernel_constraint: "None",
        recurrent_constraint: "None",
        bias_constraint: "None",
        dropout: 0.0,
        recurrent_dropout: 0.0,
        implementation: 1,
        return_sequences: "False",
        return_state: "False",
        go_backwards: "False",
        stateful: "False",
        unroll: "False",
    },
    MaxPool1D: {
        pool_size: 2,
        strides: "None",
        padding: "'valid'",
        data_format: "'channels_last'",
    },
    MaxPool3D: {
        pool_size: "(2, 2, 2)",
        strides: "None",
        padding: "'valid'",
        data_format: "None",
    },
    RepeatVector: {
        n: 1
    },
    Softmax: {
        axis: -1
    },
}

module.exports = {
    editorText: editorText,
    modelText: modelText,
    extraText: extraText,
    graph: graph,
    layerParameters: layerParameters
}