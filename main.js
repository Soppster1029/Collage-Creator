const { app, BrowserWindow, ipcMain, nativeImage, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    fullscreen: false,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('collage-slideshow.html');
  win.setMenuBarVisibility(false);

  // Prevents the initial white flash during load
  win.once('ready-to-show', () => {
    win.show();
  });
}

// Settings persistence logic
const getSettingsPath = () => path.join(app.getPath('userData'), 'settings.json');

const DEFAULT_SETTINGS = {
  collageSize: 1.0,
  imageCount: 6,
  transitionSpeed: 4000,
  layoutStyle: 'scattered',
  imageFilter: 'none',
  cardColor: '#ffffff',
  borderRadius: 0,
  backgroundColor: '#111111',
  theme: 'dark',
  fontStyle: 'sans-serif',
  fontSize: 0.8,
  showBorders: false
};

function loadSettings() {
  try {
    const settingsPath = getSettingsPath();
    if (fs.existsSync(settingsPath)) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(settingsPath, 'utf8')) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Set the dock icon specifically for macOS
  if (process.platform === 'darwin') {
    const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/icon.png'));
    app.dock.setIcon(icon);
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Handle IPC messages here
  ipcMain.on('to-main', (event, data) => {
    console.log('Main process received:', data);
    // Optionally reply back
    event.reply('from-main', 'Message received loud and clear!');
  });

  // Settings IPC Handlers
  ipcMain.handle('get-settings', () => {
    return loadSettings();
  });

  ipcMain.on('save-settings', (event, data) => {
    saveSettings(data);
  });

  // Handler to show About Dialog
  ipcMain.on('show-about', () => {
    dialog.showMessageBox({
      type: 'info',
      title: `About ${pkg.productName}`,
      message: `${pkg.productName} v${pkg.version}`,
      detail: `${pkg.build.copyright}\n\nLicense: Non-Commercial\n\n${pkg.description}`
    });
  });

  // Handler to save the current slide as an image
  ipcMain.handle('save-current-slide', async (event, defaultFilename) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);

    try {
      const image = await win.capturePage();
      const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Save Collage Image',
        defaultPath: defaultFilename || 'collage-slide.png',
        filters: [
          { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }
        ]
      });

      if (filePath) {
        fs.writeFileSync(filePath, image.toPNG());
        return true; // Indicate success
      }
    } catch (error) {
      console.error('Failed to save image:', error);
      return false; // Indicate failure
    }
    return false; // User cancelled save dialog
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});