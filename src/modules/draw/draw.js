var Konva = require('../../lib/konva');
const print = console.log;
const {
    tfGraph,
    tfNode
} = require('../../lib/graph');
const CodeMirror = require("../../lib/codemirror.js");
require("../../lib/matchbrackets.js");
require("../../lib/python.js");

$("#draw-sidebar-right").hide();


// ======================================= dataset =======================================

let initEditor =
    `# importing libraries
import tensorflow as tf
import tf.keras.layers


# main code goes here
if __name__=="__main__":
    pass
`


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
    value: initEditor
});



// ======================================= canvas draws =======================================
let isSelected = false;
let temparrow;
let firstblock;

// let graph = new tfGraph();


$('#draw-sidebar-left li').draggable({
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

var stage = new Konva.Stage({
    container: 'draw-canvas',
    width: 2 * window.innerWidth,
    height: 2 * window.innerHeight,
});

// add canvas element
var layer = new Konva.Layer();
stage.add(layer);


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
        padding: 5,
        fill: 'black',
        width: 150,
        align: 'center'
    }));

    label.on("click", (event) => {
        // print(graph);

        switch (event.evt.which) {
            case 1:
                if (temparrow == undefined) {
                    if (isSelected && firstblock == label) {
                        firstblock.getTag().stroke("#111");
                        isSelected = false;
                        firstblock = undefined;
                    } else {
                        if (firstblock) {
                            firstblock.getTag().stroke("#111");
                            firstblock = undefined;
                        }
                        label.getTag().stroke("#4f4");
                        firstblock = label;
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
                if (isSelected && label == firstblock && temparrow) {
                    firstblock.getTag().stroke("#111");
                    temparrow.remove();
                    isSelected = false;
                    firstblock = undefined;
                    temparrow = undefined;
                } else if ((!isSelected && !temparrow) || (isSelected && !temparrow)) {
                    label.getTag().stroke("#4f4");
                    temparrow = addArrow(label, null, layertoadd);
                    firstblock = label;
                    temparrow.moveToBottom()
                    isSelected = true;
                } else if (temparrow && isSelected) {
                    temparrow.remove();
                    firstblock.getTag().stroke("#111");
                    if (firstblock != label)
                        addArrow(firstblock, label, layertoadd).moveToBottom();
                    firstblock = undefined;
                    temparrow = undefined;
                    isSelected = false;
                }
                break;
            default:
                alert('You have a strange Mouse!');
        }

        if (isSelected) {
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
    // if (text == "Input Layer") {
    //     graph.addInput(new tfNode(label, 0, text));
    // } else {
    //     graph.addNode(new tfNode(label, 1, text));
    // }
    layertoadd.draw();
    return label;
}


function addArrow(shape1, shape2, layertoadd) {
    var arrow;
    if (shape2 == null) {
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

        // graph.addEdge(shape1, shape2);
    }

    layertoadd.add(arrow)
    layertoadd.draw();
    return arrow;
}




$("#draw-canvas").droppable({
    drop: function (event, ui) {
        var relativeXPosition = (event.pageX - this.offsetLeft); //offset -> method allows you to retrieve the current position of an element 'relative' to the document
        var relativeYPosition = (event.pageY - this.offsetTop);
        output = createLabel(relativeXPosition, relativeYPosition, ui.helper.text().trim(), layer)
    }
});


$(document).keyup(function (e) {
    if (e.key === "Escape") {
        if (isSelected) {
            firstblock.getTag().stroke("#111");
            if (temparrow)
                temparrow.remove()
            temparrow = undefined;
            firstblock = undefined;
            isSelected = false;
            layer.draw();
        }
    } else if (e.key === "Delete") {
        if (isSelected && !temparrow) {
            if (firstblock) {
                firstblock.remove()
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


// menu handling button click
function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#startTraining").click(function () {
    if (firstblock)
        firstblock.getTag().stroke("#111");
    if (temparrow)
        temparrow.remove();
    isSelected = false;
    firstblock = undefined;
    temparrow = undefined;
    loadPage("training/training.html");
});