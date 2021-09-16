import {app, BrowserWindow, screen} from "electron";
import * as path from "path";
import * as url from "url";

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window:
  win = new BrowserWindow({
    x: size.width * 0.125,
    y: size.height * 0.125,
    width: size.width * 0.75,
    height: size.height * 0.75,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e tests with Spectron
      // enableRemoteModule: true, // true if you want to run e2e tests with Spectron or use remote module in renderer context (i.e. Angular apps)
    },
  });

  // win.maximize();

  if (serve) {
    win.webContents.openDevTools();

    require("electron-reload")(__dirname, {
      electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    });
    win.loadURL("http://localhost:4200");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Deference from the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400ms to fix the black background issue while using a transparent window.
  app.on("ready", () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // handle error
}
