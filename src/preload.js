const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('backend', {
    runPython: (args) => ipcRenderer.invoke('run-python', {
        name: args[0],
        // after args[0]
        args: args.slice(1),
    }),
});