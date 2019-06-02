
let graph;

let editorText =
    `

`

let extraText =
    `
# importing libraries
import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.callbacks import Callback, RemoteMonitor, TensorBoard
import tensorflow as tf
from time import time

tensorboard = TensorBoard(log_dir="testing/logs/{}".format(time()), histogram_freq=0,write_graph=True,write_grads=True,write_images=True)
`

// # model callback
// class LossAcc(Callback):
//     def __init__(self):
//         super().__init__()

//     def on_epoch_end(self, epoch, logs={}):
//         print("epoch=", epoch, flush=True)
//         print("loss=", logs.get('loss'), flush=True)
//         print("acc=", logs.get('acc'), flush=True)
//         print("val_acc=", logs.get('val_acc'), flush=True)
//         print("val_loss=", logs.get('val_loss'), flush=True)

let modelText = "";

let outputParameters = {
    LoadImageFolder: {
        images_list: "",
        images_path_list: ""
    },
    LoadImageRecord: {
        images_list: "",
        images_labels_list: ""
   },
   LoadCSV: {
       rows_list: "",
       cols_list: ""
   }
}

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
    Output: {
        optimizer: "sgd",
        learning_rate: 0.001,
        loss: "mean_squared_error",
        loss_weights: "None",
        sample_weight_mode: "None",
        weighted_metrics: "None",
        target_tensors: "None",
    },
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
    LoadImageFolder: {
        filepath_regex: "",
        gray: "True",
        asbytes: "False" 
    },
    CreateImageRecord: {
        savefilename: "",
        images: "",
        labels: ""
    },
    LoadImageRecord: {
        record_filepath: "",
        image_size: "()",
        batch_size: 64,
        shuffle: "True",
        buffer_size: 1024,
        num_repeat: 1,
        one_hot_labels: "True",
        num_classes: 1
   },
   LoadCSV: {
       filepath: ""
   },
   fit: {
        x: "None",
        y: "None",
        batch_size: "None",
        epochs: 1,
        verbose: 0,
        callbacks: "[LossAcct(), tensorboard]",
        validation_split: 0.0,
        validation_data: "None",
        shuffle: "True",
        class_weight: "None",
        sample_weight: "None",
        initial_epoch: 0,
        steps_per_epoch: "None",
        validation_steps: "None",
   },
   fit_generator: {
        generator: "",
        steps_per_epoch: "None",
        epochs: 1,
        verbose: 0,
        callbacks: "None",
        validation_data: "None",
        validation_steps: "None",
        class_weight: "None",
        max_queue_size: 10,
        workers: 1,
        use_multiprocessing: "False",
        shuffle: "True",
        initial_epoch: 0
   },
   evaluate: {
        x: "None",
        y: "None",
        batch_size: "None",
        verbose: 0,
        sample_weight: "None",
        steps: "None",
        max_queue_size: 10,
        workers: 1,
        use_multiprocessing: "False"
   },
   evaluate_generator: {
        generator: "",
        steps: "None",
        max_queue_size: 10,
        workers: 1,
        use_multiprocessing: "False",
        verbose: 0
   }
}

let functionsText = ""

let projectDetails = {
    name: "",
    isOpen: false,
    details: "",
    code: "",
    graph: ""
};


module.exports = {
    editorText: editorText,
    modelText: modelText,
    extraText: extraText,
    graph: graph,
    layerParameters: layerParameters,
    outputParameters: outputParameters,
    functionsText: functionsText,
    projectDetails: projectDetails
}