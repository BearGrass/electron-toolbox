const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runPython: (args) => ipcRenderer.invoke('run-python', args),
    // require: (module) => window.require(module)
});