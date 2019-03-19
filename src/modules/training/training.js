const Chart = require('chart.js');
const global = require("../../lib/global.js");
const childprocess = require('child_process');
const print = console.log;
var fs = require('fs');

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$("#backPage").click(function () {
    loadPage("draw/draw.html")
});


function runPython() {
    let codepath = './testing/code.py';
    try {
        fs.writeFileSync(codepath, global.modelText + global.editorText, 'utf-8');
    } catch (e) {
        console.log('Failed to save the file !');
    }

    var env = Object.create(process.env);
    var pythonprocess = childprocess.spawn('python3', [codepath], {
        env: env
    });


    pythonprocess.stdout.on('data', function (data) {
        console.log(data.toString('utf8'));
    });

    pythonprocess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        $("#training-error").html(`<p class="text-danger">${data}</p>`);
        $("#training-error").append("<br><button id='backButton' class='btn btn-primary'>Go Back</button>");

        $("#backButton").click(function () {
            loadPage("draw/draw.html")
        });
        //Here is where the error output goes
    });

    pythonprocess.on('close', (code) => {
        if (code == 1) {
            $("#training-graphs").hide();
            $("#training-error").show();
        } else {
            $("#training-graphs").show();
            $("#training-error").hide();
        }
        console.log(`child process exited with code ${code}`);
    });
}

$(document).ready(function () {
    runPython();
    $("#training-error").hide();
    points = {
        x: [10, 20, 30, 40, 50],
        y: [10, 20, 16, 13, 89]
    };

    drawChart("losschart", points, "Loss on Training Data", "Loss");
    drawChart("accuracychart", points, "Accuracy on Training Data", "Accuracy");
});

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