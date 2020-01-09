const print = console.log;
const CodeMirror = require("../../lib/codemirror.js");
require("../../lib/matchbrackets.js");
require("../../lib/python.js");
require("../../lib/show-hint.js");
require("../../lib/python-hint.js");
const swal = require('sweetalert');
const global = require("../../lib/global.js")
const childprocess = require('child_process');
var fs = require('fs');
const pythonFunction = require("../../lib/datafunctions");

$("#project-name").text(global.projectDetails.name);
$("#project-details").text(global.projectDetails.details.substr(0, 20) + "...");

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
    value: global.editorText
});

codemirror.on('inputRead', function onChange(editor, input) {
    if (input.text[0] === ';' || input.text[0] === ' ' || input.text[0] === ":") {
        return;
    }
    editor.showHint({
        hint: CodeMirror.pythonHint
    });
});


let dir = global.projectDetails.name;
let basepath = process.cwd() + "/../testing/Projects/";
global.editorText = fs.readFileSync(basepath + dir + "/editor.py", "utf8");
codemirror.setValue(global.editorText);


function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

function testPython() {
    let codepath = basepath+dir+'/editor.py';
    try {
        fs.writeFileSync(codepath, codemirror.getValue(), 'utf-8');
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
            global.editorText = codemirror.getValue();
            loadPage("training/training.html");
        }
        console.log(`child process exited with code ${code}`);
    });
}


function saveProject(isShow) {
    global.editorText = codemirror.getValue();
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