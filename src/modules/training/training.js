const Chart = require('chart.js');
const global = require("../../lib/global.js");
const childprocess = require('child_process');
const print = console.log;
var fs = require('fs');
const swal = require('sweetalert');

let lossChart;
let maeChart;
let accuracyChart;

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
    // loadPage("draw/draw.html")
});


function runPython() {
    let codepath = './testing/code.py';
    try {
        fs.writeFileSync(codepath, global.editorText, 'utf-8');
    } catch (e) {
        console.log('Failed to save the file !');
    }

    var env = Object.create(process.env);
    var pythonprocess = childprocess.spawn('python3', [codepath], {
        env: env
    });


    pythonprocess.stdout.on('data', function (data) {
        $("#training-status").text("Training...");
        lines = data.toString('utf8').split(/\r\n|\r|\n/g);

        for(let i in lines){
            dataparts = lines[i].toString('utf8').split("=")
            if(dataparts[0] == "loss"){
                lossChart.data.datasets[0].data.push(parseFloat(dataparts[1]));
                lossChart.update()
            }else if(dataparts[0].includes("mean_absolute_error")){
                maeChart.data.datasets[0].data.push(parseFloat(dataparts[1]));
                maeChart.update()
            }else if(dataparts[0] == "acc"){
                accuracyChart.data.datasets[0].data.push(parseFloat(dataparts[1]));
                accuracyChart.update()
            }
        }
    });

    pythonprocess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        $("#training-error").html(`<p class="text-danger">${data}</p>`);
        $("#training-error").append("<br><button id='backButton' class='btn btn-primary'>Go Back</button>");

        $("#backButton").click(function () {
            // loadPage("draw/draw.html")
        });
        //Here is where the error output goes
    });

    pythonprocess.on('close', (code) => {
        if (code == 1) {
            $("#training-graphs").hide();
            $("#training-error").show();
            $("#training-status").text("Training failed.");
        } else {
            $("#training-graphs").show();
            $("#training-error").hide();
            $("#training-status").text("Training completed.");
            swal("Completed!", "Model training has been completed!", "success");
        }
        console.log(`child process exited with code ${code}`);
    });
}

function drawChart(id, points, title, label) {
    let ctx = $("#" + id)[0].getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: points.x,
            datasets: [{
                data: [],
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
    return chart;
}



$(document).ready(function () {
    runPython();
    $("#training-error").hide();
    
    points = {
        x: [...Array(15).keys()],
        y: []
    };

    lossChart = drawChart("losschart", points, "Loss", "Loss");
    // maeChart = drawChart("maechart", points, "Mean Absolute Error", "Mean Absolute Error");
    accuracyChart = drawChart("accuracychart", points, "Accuracy", "Accuracy");

    $("#training-status").text("Creating Model.");

});
