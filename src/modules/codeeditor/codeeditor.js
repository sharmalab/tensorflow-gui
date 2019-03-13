const CodeMirror = require("../../lib/codemirror.js");

var cm = CodeMirror(document.getElementById("code-editor"), {
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
    theme: 'material'
});