const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false,
            // webSecurity: false // 开发时允许加载本地文件
            preload: path.join(__dirname, 'preload.js') // use a preload script
        },
        minWidth: 800,
        minHeight: 600
    })
    
    mainWindow.loadFile('src/index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})