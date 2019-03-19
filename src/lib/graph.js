class tfNode {
    constructor(label, id, type = "middle") {
        this.type = type;
        this.id = id;
        this.label = label;
        this.outEdges = [];
    }

    addOutEdge(edge) {
        this.outEdges.push(edge);
    }
}

class tfEdge {
    constructor(node1, node2, arrow, id) {
        this.id = id;
        // this.fromNode = node1;
        this.toNode = node2;
        this.arrow = arrow;
        if (node2) {
            this.fromNode.addOutEdge(this)
        }
    }
}

class tfGraph {
    constructor() {
        this.numberOfEdges = 0;
        this.numberOfNodes = 0;
        this.inputs = [];
        this.outputs = [];
    }

    addInput(input) {
        this.inputs.push(input);
    }

    addOutput(output) {
        this.outputs.push(output);
    }
}

module.exports = {
    tfGraph,
    tfNode,
    tfEdge
};