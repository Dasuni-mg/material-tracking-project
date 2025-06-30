const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
  serialSync: () =>
    ipcRenderer.invoke("serial.sync", [
      { topic: "loadcell", port: "COM15" },
      { topic: "scanner", port: "COM17" },
      { topic: "printer", port: "COM19" },
    ]),
  serialRx: (topic, callback) => {
    ipcRenderer.on(`serial.rx.${topic}`, callback);
    return () => ipcRenderer.off(`serial.rx.${topic}`, callback);
  },
  serialTx: (topic, data) => ipcRenderer.invoke(`serial.tx.${topic}`, data),
});
