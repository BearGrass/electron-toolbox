const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const path = require('path')


app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // preload
            preload: path.join(__dirname, 'preload.js')
        }
    })
    ipcMain.handle('run-python', async (_, args) => {
        const { spawn } = require('child_process')
        try {
            // 检查 Python 是否可用
            const checkPython = spawn('python', ['--version'])
            checkPython.on('error', (err) => {
                console.error('Python not install:', err)
                return { output: '', error: 'Python not install' }
            })
            // log all args
            console.log('args:', args)
            console.log('start exec Python ...')
            process_path = `src/tools/${args['name']}/protocol`
            console.log(`running: `, process_path)
            console.log('ap:', args['args'])

            const pythonProcess = spawn('python', [process_path, ...args['args']])
            let output = ''
            let error = ''

            // 输出进程信息
            console.log('Python PID:', pythonProcess.pid)

            pythonProcess.stdout.on('data', (data) => {
                const stdout = data.toString()
                console.log('Python output:', stdout)
                output += stdout
            })

            pythonProcess.stderr.on('data', (data) => {
                const stderr = data.toString()
                console.error('Python err:', stderr)
                error += stderr
            })

            pythonProcess.on('close', (code) => {
                console.log('Python exit code:', code)
                if (code !== 0) {
                    console.error('Python failed')
                }
            })

            pythonProcess.on('error', (err) => {
                console.error('python err:', err)
                error += err.toString()
            })

            return new Promise((resolve, reject) => {
                pythonProcess.on('close', (code) => {
                    if (code === 0) {
                        resolve({ output, error })
                    } else {
                        reject({ output, error })
                    }
                })
            })

        } catch (err) {
            console.error('error:', err)
            return { output: '', error: err.toString() }
        }

    })
    mainWindow.loadFile('src/index.html')
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

