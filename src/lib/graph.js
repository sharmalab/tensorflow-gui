const print = console.log;

class tfNode {
    constructor(label, id, type = "middle") {
        this.type = type;
        this.id = id;
        this.label = label;
        this.outEdges = [];
        this.inEdges = [];
        this.parameters = null
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
            let tempparameters = "";

            if (layerName == "Output") {
                lastLayerName = lasttemp.label.getText().text();
                modelCode += `    model = Model(inputs=InputLayer_${layer["InputLayer"]}, outputs=${lastLayerName+"_"+layer[lastLayerName]})`;
            } else if (layerName == "InputLayer") {
                if (layerName in layer)
                    layer[layerName]++;
                else
                    layer[layerName] = 1;

                for (const [key, value] of Object.entries(temp.parameters)) {
                    tempparameters += `${key} = ${value},`
                }
                modelCode += `    ${layerName+"_"+layer[layerName]} = Input(${tempparameters})`
            } else {
                lastLayerName = lasttemp.label.getText().text();
                if (layerName in layer) {
                    layer[layerName]++;
                } else {
                    layer[layerName] = 1;
                }

                for (const [key, value] of Object.entries(temp.parameters)) {
                    tempparameters += `${key} = ${value},`
                }

                if (layerName == lastLayerName)
                    modelCode += `    ${layerName+"_"+layer[layerName]} = ${layerName}(${tempparameters})(${lastLayerName+"_"+(layer[lastLayerName] - 1)})`
                else
                    modelCode += `    ${layerName+"_"+layer[layerName]} = ${layerName}(${tempparameters})(${lastLayerName+"_"+layer[lastLayerName]})`
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