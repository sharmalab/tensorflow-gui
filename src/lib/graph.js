const print = console.log;

class tfNode {
    constructor(label, id, type = "middle") {
        this.type = type;
        this.id = id;
        this.label = label;
        this.outEdges = [];
        this.inEdges = [];
        this.parameters = {}
    }

    addOutEdge(edge) {
        this.outEdges.push(edge);
    }

    addInEdge(edge) {
        this.inEdges.push(edge);
    }
}

class tfEdge {
    constructor(node1, node2, arrow, id) {
        this.id = id;
        this.fromNode = node1;
        this.toNode = node2;
        this.arrow = arrow;
        if (node2) {
            this.fromNode.addOutEdge(this)
            this.toNode.addInEdge(this)
        }
    }
}

class tfGraph {
    constructor() {
        this.numberOfEdges = 0;
        this.numberOfNodes = 0;
        this.inputs = [];
        this.outputs = [];
        this.modelStage;
        this.modelLayers = []
    }

    addInput(input) {
        this.inputs.push(input);
    }

    addOutput(output) {
        this.outputs.push(output);
    }

    traverse() {
        let temp = this.inputs[0];
        let modelCode = "\n";
        let layer = {};
        let lasttemp, layerName, lastLayerName;
        while (temp) {
            layerName = temp.label.getText().text()
            if (layerName == "Output") {
                lastLayerName = lasttemp.label.getText().text();
                if ("Dense" == lastLayerName)
                    modelCode += `    Dense${++layer["Dense"]} = Dense(1)(${lastLayerName+(layer[lastLayerName] - 1)})`;
                else
                    modelCode += `    Dense${++layer["Dense"]} = Dense(1)(${lastLayerName+layer[lastLayerName]})`;

                modelCode += "\n";
                modelCode += `    model = Model(inputs=Input${layer["Input"]}, outputs=${lastLayerName+layer[lastLayerName]})`;
            } else if (layerName == "Input") {
                if (layerName in layer)
                    layer[layerName]++;
                else
                    layer[layerName] = 1;

                modelCode += `    ${layerName+layer[layerName]} = ${layerName}(shape=(2,))`
            } else {
                lastLayerName = lasttemp.label.getText().text();
                if (layerName in layer) {
                    layer[layerName]++;
                } else {
                    layer[layerName] = 1;
                }

                if (layerName == lastLayerName)
                    modelCode += `    ${layerName+layer[layerName]} = ${layerName}(4, activation="linear")(${lastLayerName+(layer[lastLayerName] - 1)})`
                else
                    modelCode += `    ${layerName+layer[layerName]} = ${layerName}(4, activation="linear")(${lastLayerName+layer[lastLayerName]})`
            }

            lasttemp = temp;
            if (temp.outEdges.length) {
                temp = temp.outEdges[0].toNode;
            } else {
                break;
            }
            modelCode += "\n";
        }

        return modelCode;
    }
}

module.exports = {
    tfGraph,
    tfNode,
    tfEdge
};