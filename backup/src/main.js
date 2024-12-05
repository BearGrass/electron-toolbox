const { app, BrowserWindow, ipcMain  } = require('electron')
const { spawn } = require('child_process');
const path = require('path')

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            devTools: true,
            // nodeIntegration: true,
            contextIsolation: true,   
            // webSecurity: false // 开发时允许加载本地文件
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js') // use a preload script
        },
        minWidth: 800,
        minHeight: 600
    })

    mainWindow.webContents.openDevTools();
    // 设置CSP头
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
          ]
        }
      });
    });

    ipcMain.on('run-python', (event, scriptNum) => {
      const pythonProcess = spawn('python', [`scripts/${scriptNum}.py`])
      
      pythonProcess.stdout.on('data', (data) => {
        event.reply('python-output', data.toString())
      })
    
      pythonProcess.stderr.on('data', (data) => {
        event.reply('python-error', data.toString())
      })
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