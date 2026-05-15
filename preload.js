const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Function to send data to main
  sendToMain: (channel, data) => ipcRenderer.send(channel, data),
  
  // Function to receive data from main
  receiveFromMain: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),

  // Settings persistent storage
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
  saveCurrentSlide: (defaultFilename) => ipcRenderer.invoke('save-current-slide', defaultFilename)
});