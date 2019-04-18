const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
let print = console.log;

// create new browser window
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