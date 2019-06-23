const Chart = require('chart.js');
const global = require("../../lib/global.js");
const childprocess = require('child_process');
const print = console.log;
var fs = require('fs');
const swal = require('sweetalert');

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#backPage").click(function () {
    // loadPage("draw/draw.html")
});


function runPython() {
    let codepath = `./testing/Projects/${global.projectDetails.name}/editor.py`;
    let processError = "";
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
        console.log(data);
    });

    pythonprocess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        processError = data;
    });

    pythonprocess.on('close', (code) => {
        if (code == 1) {
            swal("Error", `${processError}`, "error");
        } else {
            swal("Completed!", "Model training has been completed!", "success");
        }
        console.log(`child process exited with code ${code}`);
    });
}

$(document).ready(function () {
    runPython();
});
