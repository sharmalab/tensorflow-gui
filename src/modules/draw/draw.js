var Konva = require('../../lib/konva');
const print = console.log;
const {
    tfNode,
    tfEdge
} = require('../../lib/graph');
const CodeMirror = require("../../lib/codemirror.js");
require("../../lib/matchbrackets.js");
require("../../lib/python.js");
require("../../lib/show-hint.js");
require("../../lib/python-hint.js");
const swal = require('sweetalert');
const global = require("../../lib/global.js")
const childprocess = require('child_process');
var fs = require('fs');
const pythonFunction = require("../../lib/datafunctions");

$("#draw-sidebar-right").hide();
$("#trainbutton").hide();

$("#project-name").text(global.projectDetails.name);
$("#project-details").text(global.projectDetails.details.substr(0, 30) + "...");

var codemirror = CodeMirror(document.getElementById("code-editor"), {
    mode: {
        name: "python",
        version: 3,
        singleLineStringErrors: false
    },
    lineNumbers: true,
    indentUnit: 4,
    smartIndent: true,
    styleActiveLine: true,
    matchBrackets: true,
    value: global.editorText
});

codemirror.on('inputRead', function onChange(editor, input) {
    if (input.text[0] === ';' || input.text[0] === ' ' || input.text[0] === ":") {
        return;
    }
    editor.showHint({
        hint: CodeMirror.pythonHint
    });
});


let isSelected = false;
let temparrow;
let firstblock;
let dir = global.projectDetails.name;
let basepath = process.cwd() + "/testing/Projects/";

let graph = global.graph;
graph.modelStage = new Konva.Stage({
    container: 'draw-canvas',
    width: 2 * window.innerWidth,
    height: 2 * window.innerHeight,
});


let stage = graph.modelStage;
let layer = graph.modelLayers[0];
stage.add(layer);


$('#draw-sidebar-left div .accordion ul li').draggable({
    cursor: 'move',
    helper: function () {
        $('#main-content').append('<div id="clone" style="text-decoration:none;" class="bg-dark text-white p-2">' + $(this).html() + '</div>');
        return $("#clone");
    },
    appendTo: 'body',
    textDecoration: "none",
    start: function (e, ui) {
        ui.helper.addClass({
            textDecoration: "none"
        });
    }
});


function createLabel(x, y, text, layertoadd, id = null) {
    let label = new Konva.Label({
        x: x,
        y: y,
        draggable: true,
        transformsEnabled: 'position'
    });

    label.add(new Konva.Tag({
        cornerRadius: 6,
        lineJoin: 'round',
        fill: '#eee',
        stroke: '#333',
        // shadowColor: '#111',
    }));

    label.add(new Konva.Text({
        text: text,
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 12,
        fill: 'black',
        width: 180,
        align: 'center'
    }));


    let node;
    if (!id) {
        id = graph.numberOfNodes;
    }
    if (text == "InputLayer") {
        node = new tfNode(label, id, text, "input")
        graph.addInput(node);
    } else if (text == "Output") {
        node = new tfNode(label, id, text, "output")
        graph.addOutput(node);
    } else {
        node = new tfNode(label, id, text, "middle")
    }

    label.on("click", (event) => {

        switch (event.evt.which) {
            case 1:
                if (temparrow == undefined) {
                    if (isSelected && firstblock == node) {
                        firstblock.label.getTag().stroke("#111");
                        isSelected = false;
                        firstblock = undefined;
                    } else {
                        if (firstblock) {
                            firstblock.label.getTag().stroke("#111");
                            firstblock = undefined;
                        }
                        node.label.getTag().stroke("#4f4");
                        firstblock = node;
                        isSelected = true;
                    }
                } else {
                    print("already selected")
                }
                break;
            case 2:
                alert('Middle Mouse button pressed.');
                break;
            case 3:
                if (isSelected && node == firstblock && temparrow) {
                    firstblock.label.getTag().stroke("#111");
                    temparrow.arrow.remove();
                    isSelected = false;
                    firstblock = undefined;
                    temparrow = undefined;
                } else if ((!isSelected && !temparrow) || (isSelected && !temparrow)) {
                    node.label.getTag().stroke("#4f4");
                    temparrow = addArrow(node, null, layertoadd);
                    firstblock = node;
                    temparrow.arrow.moveToBottom()
                    isSelected = true;
                } else if (temparrow && isSelected) {
                    temparrow.arrow.remove();
                    firstblock.label.getTag().stroke("#111");
                    if (firstblock != node) {
                        let outputedge = addArrow(firstblock, node, layertoadd);
                        outputedge.arrow.moveToBottom();
                        graph.addEdge(outputedge);
                    }
                    firstblock = undefined;
                    temparrow = undefined;
                    isSelected = false;
                }
                break;
            default:
                alert('You have a strange Mouse!');
        }

        if (isSelected) {
            $("#right-sidebar-form").text('');
            $("#right-sidebar-form2").text('');
            let layerParameters = firstblock.parameters;
            let outputParameters = firstblock.outputParameters;

            if (layerParameters) {
                for (const [key, value] of Object.entries(layerParameters)) {
                    $("#right-sidebar-form").append(`
                    <div class="form-group">
                        <label for="${key}">${key}:</label>
                        <input class="form-control" id="${key}" value="${value}" required>
                    </div>
                    `);
                }
            }
            if (outputParameters) {
                for (const [key, value] of Object.entries(outputParameters)) {
                    $("#right-sidebar-form2").append(`
                    <div class="form-group">
                        <label for="${key}">${key}:</label>
                        <input class="form-control" id="${key}" value="${value}" required>
                    </div>
                    `);
                }
            }

            $("#draw-sidebar-right").show();
            $("#selectedlayer").text(label.getText().text());
        } else {
            $("#draw-sidebar-right").hide();
        }

        layertoadd.draw();
    });

    label.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    label.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });

    layertoadd.add(label);
    layertoadd.draw();
    return node;
}


function addArrow(node1, node2, layertoadd) {
    var arrow;
    let shape1 = node1.label;
    let shape2;
    let edge;
    if (node2 == null) {
        arrow = new Konva.Arrow({
            points: [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), shape1.getX() + shape1.width(), shape1.getY() + shape1.height()],
            pointerLength: 6,
            pointerWidth: 4,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2
        });

        $("#draw-canvas").mousemove(function (event) {
            var relativeXPosition = (event.pageX - this.offsetLeft); //offset -> method allows you to retrieve the current position of an element 'relative' to the document
            var relativeYPosition = (event.pageY - this.offsetTop);
            let p = [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), relativeXPosition, relativeYPosition];
            arrow.setPoints(p);
            layertoadd.draw();
        });

    } else {
        shape2 = node2.label;
        arrow = new Konva.Arrow({
            points: [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), shape2.getX() + (shape2.width() / 2), shape2.getY()],
            pointerLength: 6,
            pointerWidth: 4,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2
        });
        shape1.on("dragmove", () => {
            let p = [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), shape2.getX() + (shape2.width() / 2), shape2.getY()];
            arrow.setPoints(p);
            layertoadd.draw();
        });
        shape2.on("dragmove", () => {
            let p = [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), shape2.getX() + (shape2.width() / 2), shape2.getY()];
            arrow.setPoints(p);
            layertoadd.draw();
        });
    }

    edge = new tfEdge(node1, node2, arrow, graph.numberOfEdges)

    layertoadd.add(arrow)
    layertoadd.draw();
    return edge;
}




$("#draw-canvas").droppable({
    drop: function (event, ui) {
        var relativeXPosition = (event.pageX - this.offsetLeft);
        var relativeYPosition = (event.pageY - this.offsetTop);
        output = createLabel(relativeXPosition, relativeYPosition, ui.helper.text().trim(), layer)
        graph.addNode(output);
    }
});


$(document).keyup(function (e) {
    if (e.key === "Escape") {
        if (isSelected) {
            firstblock.label.getTag().stroke("#111");
            if (temparrow)
                temparrow.arrow.remove()
            temparrow = undefined;
            firstblock = undefined;
            isSelected = false;
            layer.draw();
        }
    } else if (e.key === "Delete") {
        if (isSelected && !temparrow) {
            if (firstblock) {
                if (firstblock.type == "input") {
                    graph.inputs = graph.inputs.filter(a => a != firstblock);
                    print(graph.inputs);
                } else if (firstblock.type == "output") {
                    graph.outputs = graph.outputs.filter(a => a != firstblock);
                }

                graph.removeNode(firstblock);

                firstblock.label.remove()
                for (let i in firstblock.outEdges) {
                    graph.removeEdge(firstblock.outEdges[i]);
                    firstblock.outEdges[i].arrow.remove()
                }
                for (let i in firstblock.inEdges) {
                    graph.removeEdge(firstblock.inEdges[i]);
                    firstblock.inEdges[i].arrow.remove()
                }
                firstblock = undefined;
            }
            isSelected = false;
            layer.draw();
        }
    }
});

try {
    if (global.isLoaded.draw) {
        throw new Error("No need to load again");
    }

    let graphdata = fs.readFileSync(basepath + dir + "/graph.json");
    let codedata = fs.readFileSync(basepath + dir + "/editor.py", "utf8");
    let savedGraph = JSON.parse(graphdata);
    let temphash = {};

    savedGraph.nodes.forEach(element => {
        let node = createLabel(element.x, element.y, element.text, layer, element.id);
        node.layerParameters = element.layerParameters;
        node.outputParameters = element.outputParameters;
        graph.addNode(node);
        temphash[element.id] = graph.nodes[graph.nodes.length - 1];
    });
    
    
    savedGraph.edges.forEach(element => {
        let edge = addArrow(temphash[element.from], temphash[element.to], layer);
        graph.addEdge(edge);
    });
    global.editorText = codedata;
    codemirror.setValue(global.editorText);
} catch (err) {
    print("skip loading graph.json", err);
}

layer.draw();


// add scaling
var scaleBy = 1.01;
stage.on('wheel', e => {
    e.evt.preventDefault();
    var oldScale = stage.scaleX();

    var mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    var newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({
        x: newScale,
        y: newScale
    });

    var newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    };
    stage.position(newPos);
    stage.batchDraw();
});

$('#right-sidebar-form').on('keyup change paste', 'input, select, textarea', function () {
    if (isSelected && firstblock) {
        let fields = {}
        $("#right-sidebar-form").find(":input").each(function () {
            fields[this.id] = $(this).val();
        });
        firstblock.parameters = fields;
    }
});

$('#right-sidebar-form2').on('keyup change paste', 'input, select, textarea', function () {
    if (isSelected && firstblock) {
        let fields = {}
        $("#right-sidebar-form2").find(":input").each(function () {
            fields[this.id] = $(this).val();
        });
        firstblock.outputParameters = fields;
    }
});

// menu handling button click
function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
    global.isLoaded.draw = false;
}

$("#goNext").click(function () {
    let tuple = graph.traverse();

    if (tuple == null) {
        swal("Oops!", "Error in generating the code!", "error");
        return;
    }

    let modelgencode = tuple[0];
    let calledList = tuple[1];
    let usedFunctions = tuple[2];

    $("#draw-canvas").hide();
    $("#draw-sidebar-left").hide();
    $("#draw-sidebar-right").hide();
    $(this).hide();

    global.modelText = "\n# Called Functions\n"
    global.modelText += calledList + "\n"

    global.modelText += "\n# Generated Model\n";
    global.modelText += modelgencode;
    global.modelText += `\n`

    if (firstblock)
        firstblock.label.getTag().stroke("#111");
    if (temparrow)
        temparrow.arrow.remove();
    isSelected = false;
    firstblock = undefined;
    temparrow = undefined;

    for (var q = 0; q < usedFunctions.length; q++) {
        global.functionsText += pythonFunction[usedFunctions[q]];
    }

    global.extraText += `

tensorboard = TensorBoard(log_dir="testing/Projects/${global.projectDetails.name}/logs/{}".format(asctime()), histogram_freq=0,write_graph=True,write_grads=True,write_images=True)

`

    codemirror.setValue(global.extraText + global.functionsText + global.editorText + global.modelText)

    $("#code-editor").show();
    $("#trainbutton").show();
});


function testPython() {
    let codepath = `./testing/Projects/${global.projectDetails.name}/editor.py`;
    try {
        fs.writeFileSync(codepath, codemirror.getValue(), 'utf-8');
    } catch (e) {
        console.log('Failed to save the file !');
    }

    var env = Object.create(process.env);
    var pythonprocess = childprocess.spawn('python3', ['-m', 'py_compile', codepath], {
        env: env
    });

    pythonprocess.on('close', (code) => {
        if (code == 1) {
            swal("Oops!", "Error in code! Please correct the code and try again!", "error");
        } else {
            global.editorText = codemirror.getValue();
            // saveProject();
            loadPage("training/training.html");
            global.projectDetails.iseditor = false;
        }
        console.log(`child process exited with code ${code}`);
    });
}


function saveProject() {
    let data = {
        nodes: [],
        edges: []
    };

    graph.nodes.forEach(element => {
        data.nodes.push({
            id: element.id,
            x: element.label.attrs.x,
            y: element.label.attrs.y,
            text: element.label.children[1].attrs.text,
            layerParameters: element.layerParameters,
            outputParameters: element.outputParameters
        });
    });
    graph.edges.forEach(element => {
        data.edges.push({
            from: element.fromNode.id,
            to: element.toNode.id
        });
    });

    fs.writeFile(basepath + dir + "/graph.json", JSON.stringify(data), 'utf-8', err => {
        if (err) {
            swal("Saving Project", "Failed to save project.", "error");
            print("Error writing file", err);
        } else {
            global.editorText = codemirror.getValue();
            fs.writeFile(basepath + dir + "/editor.py", global.editorText, 'utf-8', err => {
                if (err) {
                    swal("Saving Project", "Failed to save project.", "error");
                    print("Error writing file", err);
                } else {

                    swal("Saving Project", "Project saved successfully.", "success");
                }
            })
        }
    });
}

$("#trainbutton").click(function () {
    testPython();
});

$("#saveProject").click(function () {
    saveProject();
});

global.isLoaded.draw = true;
if (global.projectDetails.iseditor) {
    $("#draw-canvas").hide();
    $("#draw-sidebar-left").hide();
    $("#draw-sidebar-right").hide();
    $("#goNext").hide();
    $("#code-editor").show();
    $("#trainbutton").show();
}
