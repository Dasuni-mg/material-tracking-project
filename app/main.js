const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const { Writable, Readable } = require("stream");
const { SerialPort } = require("serialport");
const { Adapter } = require("./devices/lib/adapter");

async function getSerialPort(port) {
  return await new Promise((resolve, reject) => {
    const result = new SerialPort({ path: port, baudRate: 9600 }, (err) => {
      if (err)
        return reject(
          new Error(`[Serial] Cannot open port (${port}). Skipping...`)
        );
      resolve(result);
    });
  });
}

async function getDeviceAdapter(topic) {
  let result;
  try {
    const { builder } = await import(`./devices/${topic}.js`);
    if (builder instanceof Adapter.Builder) {
      result = builder;
    }
  } finally {
    if (!result)
      throw new Error(`[Serial] Adapter not found (${topic}). Skipping...`);
    return result;
  }
}

const availablePorts = new Map();

app.whenReady().then(() => {
  protocol.interceptFileProtocol("file", (request, callback) => {
    callback({
      path: path.join(
        __dirname,
        "build",
        request.url.match(/^file:\/{3}(?:[A-Z]:\/)?(.+)/)[1]
      ),
    });
  });
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  ipcMain.handle("serial.sync", async (_, configList) => {
    for (const config of configList) {
      try {
        const adapter = await getDeviceAdapter(config.topic);
        const port = await getSerialPort(config.port);
        const pipeline = port.pipe(adapter.rx().build());
        const output = new Writable({
          objectMode: true,
          write(chunk, _, callback) {
            win.webContents.send(`serial.rx.${config.topic}`, chunk);
            callback();
          },
        });
        pipeline.pipe(output);
        win.on("close", () => {
          pipeline.unpipe(output);
        });
        const input = new Readable({
          objectMode: true,
          read() {},
        });
        input.pipe(adapter.tx().build()).pipe(port);
        ipcMain.handle(`serial.tx.${config.topic}`, (_, data) => {
          input.push(data);
        });
        availablePorts.set(config.topic, port);
      } catch (e) {
        console.warn(e.message);
      }
    }
  });
  win.loadFile("/index.html");
  win.maximize();
  win.show();
});

app.on("window-all-closed", () => {
  availablePorts.forEach((port) => port.close());
  app.quit();
});
