const {
    tfGraph
} = require('./graph.js');

let graph = new tfGraph();

let editorText =
    `# complete these function for data loading and pre processing.
`

let modelText =
    `
# importing libraries
import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model
`

module.exports = {
    editorText: editorText,
    modelText: modelText,
    graph: graph
}