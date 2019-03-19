
class tfNode{
    constructor(node, id, type){
        this.type = type;
        this.id = id;
        this.node = node
        this.nextNode;
        this.visited = false;
    }

    setNextNode(input){
        this.nextNode = input;
    }
}

class tfGraph{
    constructor(){
        this.numberOfEdges = 0;
        this.numberOfNodes = 0;
        this.inputs = [];
        this.outputs = [];
        this.nodes = {}
    }

    addNode(input){
        this.nodes.push(input);
        this.numberOfNodes++;
    }

    addInput(input){
        this.inputs.push(input);
        this.addNode(input);
    }

    addEdge(input1, input2){
        input1.setNextNode(input2)
        this.numberOfEdges++;
    }
}

module.exports = {tfGraph, tfNode};
