const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lacrosseAPI', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  getDataPath: () => ipcRenderer.invoke('get-data-path')
});
