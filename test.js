const { spawn } = require("child_process");
const psList = require("ps-list");

// 🔍 Vérifie si Steam est en cours d'exécution
async function isSteamRunning() {
    const processes = await psList();
    return processes.some(p => p.name.toLowerCase() === "steam.exe");
}

// 🚀 Lance Steam si nécessaire
function launchSteam(callback) {
    const steamPath = "C:\\Program Files (x86)\\Steam\\Steam.exe";
    spawn(steamPath, (err) => {
        if (err) {
            console.error("Erreur lors du lancement de Steam:", err);
            return callback(false);
        }
        console.log("Steam lancé avec succès.");
        callback(true);
    });
}

// 🎮 Lance Scrap Mechanic après Steam
function launchScrapMechanic() {
    const gamePath = "D:\\Games\\ScrapMechanic\\Release\\ScrapMechanic.exe";
    spawn(gamePath, (err) => {
        if (err) {
            console.error("Erreur lors du lancement de Scrap Mechanic:", err);
            return;
        }
        console.log("Scrap Mechanic lancé avec succès.");
    });
}

// 🎯 Fonction principale qui gère tout
async function startScrapMechanic() {
    const isRunning = await isSteamRunning();
    if (isRunning) {
        console.log("Steam est déjà en cours d'exécution.");
        launchScrapMechanic();
    } else {
        console.log("Steam n'est pas en cours d'exécution. Lancement de Steam...");
        launchSteam((success) => {
            if (success) {
                setTimeout(() => {
                    launchScrapMechanic();
                }, 5000); // Attente de 5 secondes
            } else {
                console.error("Impossible de lancer Steam.");
            }
        });
    }
}

module.exports = { startScrapMechanic };
