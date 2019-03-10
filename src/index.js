// ============================= imports =============================
const {
    app,
    BrowserWindow
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
    })
    win.loadFile('modules/index.html')
    win.on('closed', () => {
        win = null
    })
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