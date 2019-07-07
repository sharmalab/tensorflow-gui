const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const childprocess = require('child_process');
let print = console.log;

let win;
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
}

// on ready, create the new browser window
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    let killtensorboard = childprocess.spawn('killall', ["-9", "tensorboard"]);
    if (process.platform !== 'darwin') {
        killtensorboard.on('close', (code) => {
            app.quit()
        });
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});