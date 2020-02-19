const Chart = require('chart.js');
const global = require("../../lib/global.js");
const childprocess = require('child_process');
const print = console.log;
var fs = require('fs');
const swal = require('sweetalert');
const path = require('path');

let intervalid;
let pythonprocess;
let pythonclosed = false;

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#backPage").click(function () {
    if (!pythonclosed) {
        swal("Info", "Model training is in progress. Stop the training or let it finish to go back!", "info");
    } else {
        loadPage("codeeditor/codeeditor.html")
    }
});

$("#stop-button").click(() => {
    clearInterval(intervalid);
    pythonprocess.kill('SIGINT');
});

$("#control-bar").draggable({
    axis: "y"
});

function runPython() {
    let codepath = `../testing/Projects/${global.projectDetails.name}/editor.py`;
    let processError = "";
    try {
        fs.writeFileSync(codepath, global.editorText, 'utf-8');
    } catch (e) {
        console.log('Failed to save the file !');
    }

    var env = Object.create(process.env);
    var pythoncmd = process.platform == "win32"? path.join(env['CONDA_PREFIX'],'python.exe'): 'python3';
    pythonprocess = childprocess.spawn(pythoncmd, [codepath], {
        env: env
    });
    
    setTimeout(() => {
        $("#training-status").text("Training...");
    }, 3000);

    pythonprocess.stdout.on('data', function (data) {
        console.log(data);
    });

    pythonprocess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        processError = data;
    });

    pythonprocess.on('close', (code) => {
        pythonclosed = true;
        if (code != 0) {
            $("#training-status").text("Training Failed.");
            swal("Error", `${processError}`, "error");
        } else {
            $("#training-status").text("Training Completed.");
            swal("Completed!", "Model training has been completed!", "success");
        }
        clearInterval(intervalid);
        $('#tensorboard').contents().find('#reload-button').trigger("click");
        $("#stop-button").prop('disabled', true);
        console.log(`child process exited with code ${code}`);
    });
}

$(document).ready(function () {
    $("#training-status").text("Starting Training...");
    runPython();
    intervalid = setInterval(() => {
        $('#tensorboard').contents().find('#reload-button').trigger("click");
    }, 8000);
});
