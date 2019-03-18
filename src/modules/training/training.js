const Chart = require('chart.js');

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#backPage").click(function () {
    loadPage("draw/draw.html")
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// function read(){
//     jQuery.get('now.txt',function(data){document.write(data);});
// }

function drawChart(id, points, title, label) {
    let ctx = $("#" + id)[0].getContext('2d');
    let losschart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: points.x,
            datasets: [{
                data: points.y,
                label: label,
                borderColor: getRandomColor(),
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: title,
                fontSize: 20
            },
            border: true
        }
    });
}


points = {
    x: [10, 20, 30, 40, 50],
    y: [10, 20, 16, 13, 89]
};

drawChart("losschart", points, "Loss on Training Data", "Loss");
drawChart("accuracychart", points, "Accuracy on Training Data", "Accuracy");