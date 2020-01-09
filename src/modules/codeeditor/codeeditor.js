const print = console.log;
// const CodeMirror = require("../../lib/codemirror.js");
// require("../../lib/matchbrackets.js");
// require("../../lib/python.js");
// require("../../lib/show-hint.js");
// require("../../lib/python-hint.js");
const swal = require('sweetalert');
const global = require("../../lib/global.js")
const childprocess = require('child_process');
var fs = require('fs');
const pythonFunction = require("../../lib/datafunctions");
const path = require('path');
const amdLoader = require('monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;
const amdDefine = amdLoader.require.define;


$("#project-name").text(global.projectDetails.name);
$("#project-details").text(global.projectDetails.details.substr(0, 20) + "...");

let dir = global.projectDetails.name;
let basepath = process.cwd() + "/../testing/Projects/";
global.editorText = fs.readFileSync(basepath + dir + "/editor.py", "utf8");

function uriFromPath(_path) {
    var pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}

amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
});


amdRequire(['vs/editor/editor.main'], () => {
    var codeeditor = monaco.editor.create(document.getElementById('code-editor'), {
        value: global.editorText,
        language: 'python',
        autoIndent: true
    });

    function loadPage(page_path) {
        $("#main-content").html('');
        $("#main-content").load(page_path);
    }

    function testPython() {
        let codepath = basepath + dir + '/editor.py';
        try {
            fs.writeFileSync(codepath, codeeditor.getValue(), 'utf-8');
        } catch (e) {
            console.log('Failed to save the file !');
        }

        var env = Object.create(process.env);
        var pythonprocess = childprocess.spawn('python3', ['-m', 'py_compile', codepath], {
            env: env
        });

        pythonprocess.on('close', (code) => {
            if (code != 0) {
                swal("Oops!", "Error in code! Please correct the code and try again!", "error");
            } else {
                global.editorText = codeeditor.getValue();
                loadPage("training/training.html");
            }
            console.log(`child process exited with code ${code}`);
        });
    }


    function saveProject(isShow) {
        global.editorText = codeeditor.getValue();
        fs.writeFile(basepath + dir + "/editor.py", global.editorText, 'utf-8', err => {
            if (err) {
                swal("Saving Project", "Failed to save project.", "error");
                print("Error writing file", err);
            } else {
                if (isShow)
                    swal("Saving Project", "Project saved successfully.", "success");
            }
        });
    }

    $("#trainbutton").click(function () {
        testPython();
    });

    $("#saveProject").click(function () {
        saveProject(true);
    });

    $("#backButton").click(function () {
        loadPage("user/user.html");
    });
});