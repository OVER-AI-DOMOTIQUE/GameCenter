const { ipcRenderer } = require('electron');
const apps = require('./app.js'); // On importe un nouveau fichier apps.js

// Gestion des boutons de fenêtre
document.getElementById('minimize').addEventListener('click', () => {
  ipcRenderer.send('window-minimize');
});

document.getElementById('maximize').addEventListener('click', () => {
  ipcRenderer.send('window-maximize');
});

document.getElementById('close').addEventListener('click', () => {
  ipcRenderer.send('window-close');
});

// 🔙 Retour à la page principale
document.getElementById('return').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// 🎯 Chargement de la App Grid
function loadApps() {
  const appGrid = document.getElementById('appGrid');
  appGrid.innerHTML = '';

  apps.forEach((app) => {
    const appItem = document.createElement('div');
    appItem.classList.add('game-item'); // Réutilisation du style de Game Grid

    const img = document.createElement('img');
    img.src = app.iconPath;
    img.alt = app.name;

    const span = document.createElement('span');
    span.textContent = app.name;

    appItem.appendChild(img);
    appItem.appendChild(span);

    // Clic sur l'application pour la lancer
    appItem.addEventListener('click', () => {
      console.log(`Lancement de : ${app.path}`);

      const { spawn } = require('child_process');
      const appProcess = spawn(app.path, [], {
        detached: true,
        shell: true,
        windowsHide: false
      });

      appProcess.on('error', (err) => {
        console.error(`❌ Erreur lors du lancement de ${app.name} :`, err);
      });

      appProcess.unref();
    });

    appGrid.appendChild(appItem);
  });
}

// Initialisation
loadApps();
