const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const games = require('./game.js');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// Créer la fenêtre Electron avec une barre personnalisée
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true, // Démarrage en plein écran
    frame: false, // Barre personnalisée
    icon: path.join(__dirname, 'icons', 'app_icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  Menu.setApplicationMenu(null);

  // Gestion des boutons
  const { ipcMain } = require('electron');

  ipcMain.on('window-minimize', () => {
    win.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (win.isFullScreen()) {
      win.setFullScreen(false);
    } else if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    win.close();
  });
}

// Lancer l'application
app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
