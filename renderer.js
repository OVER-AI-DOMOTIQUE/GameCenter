console.log("🚀 Chargement de l'application...");
const games = require('./game.js');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { ipcRenderer } = require('electron');

function getAllCategories() {
  const categories = new Set();
  games.forEach(game => {
    game.categories.forEach(category => categories.add(category));
  });
  return Array.from(categories).sort();
}

function populateCategoryFilter() {
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '';

  // Option par défaut "Tous"
  const allOption = document.createElement('option');
  allOption.value = 'tous';
  allOption.textContent = 'Tous';
  categorySelect.appendChild(allOption);

  // Remplir les catégories disponibles
  getAllCategories().forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function loadGames(category = 'tous') {
  const gameGrid = document.getElementById('gameGrid');
  gameGrid.innerHTML = '';

  let filteredGames = category === 'tous'
    ? [...games].sort((a, b) => a.name.localeCompare(b.name))
    : games.filter(game => game.categories.includes(category));

  filteredGames.forEach((game) => {
    const sanitizedGameName = game.name.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const iconFilePath = path.join(__dirname, 'icons', `${sanitizedGameName}.png`);
    const iconExists = fs.existsSync(iconFilePath);
    const iconPath = iconExists

    const gameItem = document.createElement('div');
    gameItem.classList.add('game-item');

    const img = document.createElement('img');
    img.src = game.iconPath;
    img.alt = game.name;

    img.onload = () => {
      if (img.naturalWidth < 100 || img.naturalHeight < 100) {
        img.style.objectPosition = 'center';
        img.style.padding = '20px';
      }
    };

    const span = document.createElement('span');
    span.textContent = game.name;

    gameItem.appendChild(img);
    gameItem.appendChild(span);

    gameItem.addEventListener('click', () => {
      console.log(`Lancement de : ${game.path}`);

      const gameProcess = spawn(game.path, [], {
        detached: true,
        shell: true,
        windowsHide: false
      });

      gameProcess.on('error', (err) => {
        console.error(`❌ Erreur lors du lancement de ${game.name} :`, err);
      });

      gameProcess.stdout?.on('data', (data) => {
        console.log(`📤 ${game.name} sortie : ${data}`);
      });

      gameProcess.stderr?.on('data', (data) => {
        console.error(`❌ ${game.name} erreur : ${data}`);
      });

      gameProcess.unref();
    });

    gameGrid.appendChild(gameItem);
  });
}

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

// Initialisation
populateCategoryFilter();
loadGames();

document.getElementById('category').addEventListener('change', (event) => {
  const selectedCategory = event.target.value;
  loadGames(selectedCategory);
});

document.getElementById('search').addEventListener('input', (event) => {
  const searchValue = event.target.value.toLowerCase();
  const games = document.querySelectorAll('.game-item');

  games.forEach((game) => {
    const gameName = game.querySelector('span').textContent.toLowerCase();
    game.style.display = gameName.includes(searchValue) ? '' : 'none';
  });
});
// 🎯 Redirection vers index2.html
document.getElementById('accessory').addEventListener('click', () => {
  window.location.href = 'accessoire.html'; // Redirection
});

document.getElementById('download-button').addEventListener('click', () => {
  ipcRenderer.send('download-games');
})

document.getElementById('download-button').addEventListener('click', () => {
  ipcRenderer.send('download-games');
});