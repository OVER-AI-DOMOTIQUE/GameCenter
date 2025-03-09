const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const AdmZip = require('adm-zip');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    frame: false,
    icon: path.join(__dirname, 'icons', 'app_icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  Menu.setApplicationMenu(null);

  ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow.close();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('download-games', async () => {
  if (!mainWindow) return;

  const url = 'https://github.com/OVER-AI-DOMOTIQUE/GameCenter/releases/latest/download/games.zip';
  const installPath = path.resolve(process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath('exe')));

  try {
    if (!fs.existsSync(installPath)) {
      fs.mkdirSync(installPath, { recursive: true });
    }

    const zipPath = path.join(installPath, 'games.zip');
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(zipPath, response.data);

    const zip = new AdmZip(zipPath);
    zip.extractAllTo(installPath, true);

    fs.unlinkSync(zipPath);

    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Téléchargement terminé',
      message: `Les jeux ont été installés dans :\n${installPath}`
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement :', error);
    dialog.showErrorBox('Erreur', 'Le téléchargement a échoué. Vérifie ta connexion ou l’URL.');
  }
});
