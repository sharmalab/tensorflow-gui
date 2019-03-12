// ============================= imports =============================
const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
let print = console.log;

// Enable live reload
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});


// ============================= global variabals =============================
let win;


// ============================= functions =============================
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        nodeIntegration: true
    });
    win.loadFile('modules/index.html')
    win.on('closed', () => {
        win = null
    });


    // TODO: define prompt window for initate the project
    // ipcMain.on('prompt', function (eventRet, arg) {
    //     var promptWindow = new BrowserWindow({
    //         width: 200,
    //         height: 100,
    //         show: false,
    //         resizable: false,
    //         movable: false,
    //         alwaysOnTop: true,
    //         frame: true,
    //         parent: win
    //     })
    //     arg.val = arg.val || ''
    //     const promptHtml = '<body><label for="val">' + arg.title + '</label>\
    //   <input id="val" value="' + arg.val + '" autofocus />\
    //   <button onclick="require(\'electron\').ipcRenderer.sendSync(\'prompt-reply\', document.getElementById(\'val\').value);window.close()">Ok</button>\
    //   <button onclick="window.close()">Cancel</button>\
    //   <style>body {font-family: sans-serif;} button {float:right; margin-left: 10px;} label,input {margin-bottom: 10px; width: 100%; display:block;}</style> </body>'
    //     promptWindow.loadURL('data:text/html,' + promptHtml)
    //     promptWindow.show()
    //     promptWindow.on('closed', function () {
    //         promptWindow = null
    //     })
    // })
}


// ============================= main code ============================= 
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});