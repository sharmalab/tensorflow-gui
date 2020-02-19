const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron')
const childprocess = require('child_process');
let print = console.log;

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        darkTheme: true,
        webPreferences: { nodeIntegration: true},
    });
    win.loadFile('modules/index.html')
    win.on('closed', () => {
        win = null
    });

    var menu = Menu.buildFromTemplate([{
        label: 'File',
        submenu: [
            {
                label: 'Home',
                click() {
                    win.reload();
                }
            },
            {
                label: 'Debug Mode',
                accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
                click(){
                    win.webContents.openDevTools();
                }
            },
            { label: 'Exit' }
        ]
    }]);
    Menu.setApplicationMenu(menu);

}

// on ready, create the new browser window
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    let killtensorboard;
    if (process.platform == 'win32') {
        killtensorboard = childprocess.spawn('taskkill', ['/f','/im', 'tensorboard'])
    }else{
        killtensorboard = childprocess.spawn('killall', ["-9", "tensorboard"]);
    }
    
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