const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const path = require('path')


app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 960,
        autoHideMenuBar: true, // 自动隐藏菜单栏
        frame: true,  // 保留窗口边框
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
                console.log('Python output:\n', stdout)
                output += stdout
            })

            pythonProcess.stderr.on('data', (data) => {
                const stderr = data.toString()
                console.error('Python err:', stderr)
                error += stderr
            })

            return new Promise((resolve, reject) => {
                pythonProcess.on('close', (code) => {
                    if (code === 0) {
                        console.log('Python process finished')
                        console.log('Final output:', output) // 调试用

                        // 确保返回正确的对象结构
                        const result = {
                            output_text: output,
                            error: error
                        }

                        console.log('Returning result:', result) // 调试用
                        resolve(result)
                    } else {
                        reject({ output_text: output, error: error })
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

