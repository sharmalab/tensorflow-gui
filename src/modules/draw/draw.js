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
$("#startTraining").hide();

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

function createLabel(x, y, text, layertoadd) {
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
        shadowColor: '#111',
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
    graph.numberOfNodes++;

    let node;
    if (text == "InputLayer") {
        node = new tfNode(label, graph.numberOfNodes, text, "input")
        graph.addInput(node);
    } else if (text == "Output") {
        node = new tfNode(label, graph.numberOfNodes, text, "output")
        graph.addOutput(node);
    } else {
        node = new tfNode(label, graph.numberOfNodes, text, "middle")
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
                    if (firstblock != node)
                        addArrow(firstblock, node, layertoadd).arrow.moveToBottom();
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
            let layerParameters;
            let outputParameters;
            if (firstblock.parameters == null) {
                layerParameters = global.layerParameters[label.getText().text()];
                firstblock.parameters = layerParameters;
            } else {
                layerParameters = firstblock.parameters;
            }

            if(firstblock.outputParameters == null) {
                outputParameters = global.outputParameters[label.getText().text()];
                firstblock.outputParameters = outputParameters;
            } else {
                outputParameters = firstblock.outputParameters;
            }

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
        graph.numberOfEdges++;
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
                    graph = graph.inputs.filter(a => a != firstblock);
                } else if (firstblock.type == "output") {
                    graph = graph.outputs.filter(a => a != firstblock);
                }

                firstblock.label.remove()
                for (let i in firstblock.outEdges)
                    firstblock.outEdges[i].arrow.remove()
                for (let i in firstblock.inEdges)
                    firstblock.inEdges[i].arrow.remove()
                firstblock = undefined;
            }
            isSelected = false;
            layer.draw();
        }
    }
});

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
    
    global.modelText +=
        `
# function for training model
def train():
    model = Network()
    x,y = getTrainingData()
    model.fit(x = x, y = y, epochs=15, batch_size=100, callbacks=[LossAcc()], verbose=0)

# code execution starts here
train()
`
    if (firstblock)
        firstblock.label.getTag().stroke("#111");
    if (temparrow)
        temparrow.arrow.remove();
    isSelected = false;
    firstblock = undefined;
    temparrow = undefined;

    for(var q=0;q<usedFunctions.length;q++){
        global.functionsText += pythonFunction[usedFunctions[q]];
    }

    codemirror.setValue(global.functionsText + global.editorText + global.modelText)

    $("#code-editor").show();
    $("#startTraining").show()
});


function testPython() {
    let codepath = './testing/code.py';
    try {
        fs.writeFileSync(codepath, global.extraText + codemirror.getValue(), 'utf-8');
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
        }else{
            global.editorText = global.extraText + codemirror.getValue();
            loadPage("training/training.html");
        }
        console.log(`child process exited with code ${code}`);
    });
}

$("#startTraining").click(function () {
    testPython();
});