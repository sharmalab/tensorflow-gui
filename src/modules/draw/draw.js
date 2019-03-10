var Konva = require('../../lib/konva');
const print = console.log;

var stage = new Konva.Stage({
    container: 'draw-canvas',
    width: window.innerWidth - $("#draw-sidebar-right").width() - 1.5 * $("#draw-sidebar-left").width(),
    height: window.innerHeight,
});

// add canvas element
var layer = new Konva.Layer();
stage.add(layer);

var rect = new Konva.Rect({
    x: stage.width()/2 - 80,
    y: 0,
    stroke: '#555',
    strokeWidth: 5,
    fill: '#eee',
    width: 300,
    height: 700,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: [10, 10],
    shadowOpacity: 0.2,
    cornerRadius: 10,
    draggable: true
});

layer.add(rect);


function createLabel(x, y, text, layertoadd) {
    let label = new Konva.Label({
        x: x,
        y: y,
        opacity: 0.75,
        draggable: true
    });

    label.add(new Konva.Tag({
        fill: '#cccccc'
    }));

    label.add(new Konva.Text({
        text: text,
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'black',
        width: 150,
        height: 30,
        align: 'center'
    }));

    label.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
    });
    label.on('mouseout', function () {
        document.body.style.cursor = 'default';
    });

    layertoadd.add(label);
    return label;
}


input = createLabel(stage.width() / 2, 20, "Input", layer)
conv1 = createLabel(stage.width() / 2, 70, "Conv2D-1", layer)
conv2 = createLabel(stage.width() / 2, 120, "Conv2D-2", layer)
maxpooling1 = createLabel(stage.width() / 2, 170, "MaxPooling2D-1", layer)
conv3 = createLabel(stage.width() / 2, 220, "Conv2D-3", layer)
conv4 = createLabel(stage.width() / 2, 270, "Conv2D-4", layer)
maxpooling2 = createLabel(stage.width() / 2, 320, "MaxPooling2D-2", layer)
flatten1 = createLabel(stage.width() / 2, 370, "Flatten-1", layer)
dropout1 = createLabel(stage.width() / 2, 420, "Dropout-1", layer)
dense1 = createLabel(stage.width() / 2, 470, "Dense-1", layer)
dropout2 = createLabel(stage.width() / 2, 520, "Dropout-2", layer)
dense2 = createLabel(stage.width() / 2, 570, "Dense-2", layer)
output = createLabel(stage.width() / 2, 620, "Output", layer)


function addArrow(shape1, shape2, layertoadd) {
    var arrow = new Konva.Arrow({
        points: [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), shape2.getX() + (shape2.width() / 2), shape2.getY()],
        pointerLength: 10,
        pointerWidth: 8,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 4
    });

    shape1.on("dragmove", ()=>{
        let p = [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), shape2.getX() + (shape2.width() / 2), shape2.getY()];
        arrow.setPoints(p);
        layertoadd.draw();
    });
    shape2.on("dragmove", ()=>{
        let p = [shape1.getX() + (shape1.width() / 2), shape1.getY() + shape1.height(), shape2.getX() + (shape2.width() / 2), shape2.getY()];
        arrow.setPoints(p);
        layertoadd.draw();
    });

    layertoadd.add(arrow)
    return arrow;
}

addArrow(input, conv1, layer);
addArrow(conv1, conv2, layer);
addArrow(conv2, maxpooling1, layer);
addArrow(maxpooling1, conv3, layer);
addArrow(conv3, conv4, layer);
addArrow(conv4, maxpooling2, layer);
addArrow(maxpooling2, flatten1, layer);
addArrow(flatten1, dropout1, layer);
addArrow(dropout1, dense1, layer);
addArrow(dense1, dropout2, layer);
addArrow(dropout2, dense2, layer);
addArrow(dense2, output, layer);


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