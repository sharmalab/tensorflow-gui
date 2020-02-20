var Konva = require('../../lib/konva');
const {
    tfNode,
    tfEdge
} = require('../../lib/graph');
const pythonFunction = require("../../lib/datafunctions");

let temparrow;
let firstblock;
let isSelected;
let dir;

function init(){
    isSelected = false;
    temparrow = undefined;
    firstblock = undefined;
    dir = globaljs.projectDetails.name;

    let graph = globaljs.graph;
    $("#draw-sidebar-right").hide();
    $("#codenode-desc").hide();
    $("#project-name").text(globaljs.projectDetails.name);
    $("#project-details").text(globaljs.projectDetails.details.substr(0, 20) + "...");
    graph.modelStage = new Konva.Stage({
        container: 'draw-canvas',
        width: 2 * window.innerWidth,
        height: 2 * window.innerHeight,
    });
    let stage = graph.modelStage;
    let layer = graph.modelLayer;
    stage.add(layer);
    
    // if (!globaljs.isLoaded.nodeeditor) {
    let graphdata = fs.readFileSync(path.join(projects_path, dir, "graph.json"));
    let savedGraph = JSON.parse(graphdata);
    let temphash = {};

    savedGraph.nodes.forEach(element => {
        let node = createLabel(element.x, element.y, element.text, layer, element.id);
        node.parameters = element.parameters;
        node.outputParameters = element.outputParameters;
        globaljs.graph.addNode(node);
        temphash[element.id] = graph.nodes[graph.nodes.length - 1];
    });

    savedGraph.edges.forEach(element => {
        let edge = addArrow(temphash[element.from], temphash[element.to], layer);
        globaljs.graph.addEdge(edge);
    });
    layer.draw();
    // }
    // globaljs.isLoaded.nodeeditor = true;
    // layer.draw();

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
                $("#draw-sidebar-right").hide();
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
                    $("#draw-sidebar-right").hide();
                }
                isSelected = false;
                layer.draw();
            }
        }
    });
        
    $("#saveProject").click(function () {
        saveProject();
    });

    $("#new-codenode-btn").click(function () {
        $("#codenode-desc").show();
        $("#new-codenode-btn").hide();
    });

    $("#codenode-cancel-btn").click(function () {
        $("#codenode-desc").hide();
        $("#new-codenode-btn").show();

        $("#codenode-name").val('');
        $("#codenode-code").val('');
        $("#codenode-parameters").val('');
        $("#codenode-returns").val('');
    });

    $("#codenode-create-btn").click(function () {
        let name = $("#codenode-name").val();
        let code = $("#codenode-code").val();
        let parameters = $("#codenode-parameters").val();
        let returns = $("#codenode-returns").val();

        let temp = code.split(/\n/);
        for (var i = 0; i < temp.length; i++) {
            temp[i] = "    " + temp[i];
        }
        temp = temp.join("\n");

        pythonFunction[name] = `
def ${name}(${parameters}):
${temp}
    return ${returns}
`

        temp = {};
        parameters.split(",").forEach((par) => {
            temp[par] = "";
        });
        globaljs.layerParameters[name] = temp;

        temp = {};
        returns.split(",").forEach((par) => {
            temp[par] = "";
        });
        if(temp != {}){
            globaljs.outputParameters[name] = temp;
        }

        temp = createLabel(400, 400, name, layer);
        graph.addNode(temp);
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
    
}    

function generateCode(){
    let tuple = globaljs.graph.traverse();

    if (tuple == null) {
        swal("Oops!", "Error in generating the code!", "error");
        return;
    }

    let modelgencode = tuple[0];
    let calledList = tuple[1];
    let usedFunctions = tuple[2];

    globaljs.modelText = "\n# Called Functions\n"
    globaljs.modelText += calledList + "\n"

    globaljs.modelText += "\n# Generated Model\n";
    globaljs.modelText += modelgencode;
    globaljs.modelText += `\n`

    if (firstblock)
        firstblock.label.getTag().stroke("#111");
    if (temparrow)
        temparrow.arrow.remove();
    isSelected = false;
    firstblock = undefined;
    temparrow = undefined;

    for (var q = 0; q < usedFunctions.length; q++) {
        globaljs.functionsText += pythonFunction[usedFunctions[q]];
    }

    globaljs.extraText += `
tensorboard = TensorBoard(log_dir="../testing/Projects/${globaljs.projectDetails.name}/logs/{}".format(asctime().replace(":","-")), histogram_freq=0,write_graph=True,write_grads=True,write_images=True)

`
    fs.writeFileSync(path.join(projects_path, dir, "editor.py"), globaljs.extraText + globaljs.functionsText + globaljs.modelText, 'utf-8');
}

function createLabel(x, y, text, layertoadd, id = null) {
    let graph = globaljs.graph;
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

    edge = new tfEdge(node1, node2, arrow, globaljs.graph.numberOfEdges)

    layertoadd.add(arrow)
    layertoadd.draw();
    return edge;
}

// add scaling
// var scaleBy = 1.01;
// stage.on('wheel', e => {
//     e.evt.preventDefault();
//     var oldScale = stage.scaleX();

//     var mousePointTo = {
//         x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
//         y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
//     };

//     var newScale =
//         e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
//     stage.scale({
//         x: newScale,
//         y: newScale
//     });

//     var newPos = {
//         x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
//         y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
//     };
//     stage.position(newPos);
//     stage.batchDraw();
// });

function saveProject() {
    let data = {
        nodes: [],
        edges: []
    };

    globaljs.graph.nodes.forEach(element => {
        data.nodes.push({
            id: element.id,
            x: element.label.attrs.x,
            y: element.label.attrs.y,
            text: element.label.children[1].attrs.text,
            parameters: element.parameters,
            outputParameters: element.outputParameters
        });
    });
    globaljs.graph.edges.forEach(element => {
        data.edges.push({
            from: element.fromNode.id,
            to: element.toNode.id
        });
    });

    fs.writeFile(path.join(projects_path, dir, "graph.json"), JSON.stringify(data), 'utf-8', err => {
        if (err) {
            swal("Saving Project", "Failed to save project.", "error");
            print("Error writing file", err);
        } else {
            swal("Saving Project", "Project saved successfully.", "success");
        }
    });
}

module.exports = {
    saveProject: saveProject,
    init: init,
    generateCode: generateCode
}