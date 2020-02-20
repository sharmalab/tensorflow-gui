const pythonFunction = require("../../lib/datafunctions");
const amdLoader = require('monaco-editor/min/vs/loader.js');
const amdRequire = amdLoader.require;
const amdDefine = amdLoader.require.define;

var codeeditor;

function uriFromPath(_path) {
    var pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}

function saveProject(isShow) {
    let dir = globaljs.projectDetails.name;
    globaljs.editorText = codeeditor.getValue();
    fs.writeFile(path.join(projects_path, dir, "editor.py"), globaljs.editorText, 'utf-8', err => {
        if (err) {
            swal("Saving Project", "Failed to save project.", "error");
            print("Error writing file", err);
        } else {
            if (isShow)
                swal("Saving Project", "Project saved successfully.", "success");
        }
    });
}

function init(){
    codeeditor = undefined;
    $("#project-name").text(globaljs.projectDetails.name);
    $("#project-details").text(globaljs.projectDetails.details.substr(0, 20) + "...");
    let dir = globaljs.projectDetails.name;
    globaljs.editorText = fs.readFileSync(path.join(projects_path, dir, "editor.py"), "utf8");
    amdRequire.config({
        baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
    });
    
    amdRequire(['vs/editor/editor.main'], () => {
        codeeditor = monaco.editor.create(document.getElementById('code-editor'), {
            value: globaljs.editorText,
            language: 'python',
            autoIndent: true
        });
    });
}

module.exports = {
    init: init,
    saveProject: saveProject
}