let pythonclosed;
let intervalid;
let pythonprocess;

function runPython() {
    let codepath = `../testing/Projects/${globaljs.projectDetails.name}/editor.py`;
    let processError = "";
    try {
        fs.writeFileSync(codepath, globaljs.editorText, 'utf-8');
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

function init() {
    pythonclosed = false;

    $("#control-bar").draggable({
        axis: "y"
    });

    $("#training-status").text("Starting Training...");
    runPython();
    intervalid = setInterval(() => {
        $('#tensorboard').contents().find('#reload-button').trigger("click");
    }, 8000);

    $("#stop-button").click(() => {
        clearInterval(intervalid);
        pythonclosed = true;
        pythonprocess.kill('SIGINT');
    });

}

module.exports = {
    init: init,
    pythonclosed: pythonclosed
}