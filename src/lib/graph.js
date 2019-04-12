const print = console.log;
let global = require("./global.js");

class tfNode {
    constructor(label, id, name, type = "middle") {
        this.type = type;
        this.id = id;
        this.label = label;
        this.outEdges = [];
        this.inEdges = [];
        this.parameters = global.layerParameters[name];
        this.outputParameters = global.outputParameters[name];
        this.name = name;
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


    bfs(temp2) {
        if (temp2.inEdges.length == 0){
            this.calledList = this.calledList.reverse().join('\n'); 
        }else{
            let queue = [];
            for(var i=0;i<temp2.inEdges.length;i++){
                queue.push(temp2.inEdges[i].fromNode);
            }
            while(queue.length > 0){
                temp2 = queue.shift();
                
                let tstr = "";
                let tempparameters = "";
                let layerName = temp2.name;
                this.usedFunctions.push(layerName);
    
                for (const [key, value] of Object.entries(temp2.parameters)) {
                    tempparameters += `${key} = ${value},`;
                }
    
                let outparameters = "";
                if (temp2.outputParameters) {
                    for (const [key, value] of Object.entries(temp2.outputParameters)) {
                        outparameters += `${value},`;
                    }
                    tstr = `${outparameters} = ${layerName}(${tempparameters})`;
                    this.calledList.push(tstr);
                } else {
                    tstr = `${layerName}(${tempparameters})`;
                    this.calledList.push(tstr);
                }
                for(var i=0;i<temp2.inEdges.length;i++){
                    queue.push(temp2.inEdges[i].fromNode);
                }
            }
            this.calledList = this.calledList.reverse().join('\n'); 
        }
    }

    traverse() {
        let temp = this.inputs[0];
        let modelCode = "\n";
        let layer = {};
        let lasttemp, layerName, lastLayerName;
        let isCorrectModel = {
            InputLayer: false,
            Output: false,
            middle: false
        };
        this.calledList = []
        this.usedFunctions = []
        try {
            this.bfs(temp)
            
            temp = this.inputs[0];
            while (temp) {
                layerName = temp.name;
                let tempparameters = "";

                if( layerName == "fit" || layerName == "fit_generator" || layerName == "evaluate" || layerName == "evaluate_generator" ){

                    for (const [key, value] of Object.entries(temp.parameters)) {
                        tempparameters += `${key} = ${value},`
                    }

                    modelCode += `\n# function for training model
def train():
    model = Network()
    x,y = getTrainingData()
    model.${layerName}(${tempparameters})\n`;

                }else if (layerName == "Output") {
                    isCorrectModel.Output = true;
                    lastLayerName = lasttemp.name;

                    modelCode += `    model = Model(inputs=InputLayer_${layer["InputLayer"]}, outputs=${lastLayerName+"_"+layer[lastLayerName]})\n`;
                    print(temp.parameters["optimizer"])
                    switch(temp.parameters["optimizer"]) {
                        case "sgd":
                            modelCode += `    optimizer = tf.keras.optimizers.SGD(lr=${temp.parameters["learning_rate"]}, momentum=0.0, decay=0.0,)\n`;
                            break;
                        case "adam":
                            modelCode += `    optimizer = tf.keras.optimizers.Adam(lr=${temp.parameters["learning_rate"]}, beta_1=0.9,beta_2=0.999, epsilon=None, decay = 0.0, amsgrad=False)\n`;
                            break;
                        default:
                            break;
                    }


                    for (const [key, value] of Object.entries(temp.parameters)) {
                        if(key != "optimizer" && key != "learning_rate")
                            tempparameters += `${key} = ${value},`
                    }

                    modelCode += `    model = Model(inputs=InputLayer_${layer["InputLayer"]}, outputs=${lastLayerName+"_"+layer[lastLayerName]})\n`;
                    modelCode += `    model.compile(metrics=['mae','accuracy'], optimizer=optimizer , ${tempparameters})\n`
                    modelCode += `    return model\n`
                } else if (layerName == "InputLayer") {
                    isCorrectModel.InputLayer = true;
                    if (layerName in layer)
                        layer[layerName]++;
                    else
                        layer[layerName] = 1;

                    for (const [key, value] of Object.entries(temp.parameters)) {
                        tempparameters += `${key} = ${value},`
                    }
                    
                    modelCode += "def Network():\n";
                    modelCode += `    ${layerName+"_"+layer[layerName]} = Input(${tempparameters})`
                } else {
                    isCorrectModel.middle = true;
                    lastLayerName = lasttemp.name;
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
        } catch (err) {
            console.log(err)
            return null;
        }

        if (isCorrectModel.Output && isCorrectModel.InputLayer && isCorrectModel.middle) {
            return [modelCode, this.calledList, this.usedFunctions];
        } else {
            return null;
        }
    }
}


global.graph = new tfGraph()
let layer = new Konva.Layer();
global.graph.modelLayers.push(layer)


module.exports = {
    tfGraph,
    tfNode,
    tfEdge
};