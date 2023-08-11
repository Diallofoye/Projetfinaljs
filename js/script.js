// les références des éléments de la page HTML

const grid = document.getElementById('grid');
const scoreElement = document.getElementById('score');

// Initialisez les variables du jeu
let score = 0;
let playerX = 0;
let playerY = 0;
let treasuresCollected = 0;
const totalTreasures = 3;
const monsters = [
  { x: 8, y: 4 }, // Coordonnées du premier monstre
  { x: 9, y: 7 }  // Coordonnées du deuxième monstre
];


// La grille du donjon représentée par un tableau en 2 dimensions
const dungeonGrid = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'player', 'empty','wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ];


// Positionnement des monstres dans le tableau dungeonGrid
dungeonGrid[4][8] = 'monster';
dungeonGrid[7][9] = 'monster';

// Positionnement des trésors dans le tableau dungeonGrid
dungeonGrid[3][10] = 'treasure';
dungeonGrid[6][3] = 'treasure';
dungeonGrid[8][13] = 'treasure';

// Génère la grille du jeu
function generateGrid() {
  for (let y = 0; y < dungeonGrid.length; y++) {
    for (let x = 0; x < dungeonGrid[y].length; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (dungeonGrid[y][x] === 'player') {
        cell.classList.add('player');
        playerX = x;
        playerY = y;
      } else if (dungeonGrid[y][x] === 'treasure') {
        cell.classList.add('treasure');
      } else if (dungeonGrid[y][x] === 'monster') {
        cell.classList.add('monster');
      } else if (dungeonGrid[y][x] === 'wall') {
        cell.classList.add('wall');
      } else {
        cell.classList.add('empty');
      }

      grid.appendChild(cell);
    }
  }
}
// Affiche la grille du jeu
function displayGrid() {

  grid.innerHTML = '';
 
  generateGrid();
}
// Vérifie l'état du jeu (victoire ou défaite)
function checkGameStatus() {
  
}
// Met à jour le score affiché
function updateScore() {
 
  scoreElement.textContent = score;
  
}
// Déplace le joueur dans la grille
function movePlayer(directionX, directionY) {
  const newX = playerX + directionX;
  const newY = playerY + directionY;

  if (
    newX >= 0 &&
    newX < dungeonGrid[0].length &&
    newY >= 0 &&
    newY < dungeonGrid.length &&
    dungeonGrid[newY][newX] !== 'wall'
  ) {
    if (dungeonGrid[newY][newX] === 'monster') {
      gameOver();
    } else if (dungeonGrid[newY][newX] === 'treasure') {
      score++;
      treasuresCollected++;
      updateScore();
      dungeonGrid[newY][newX] = 'empty';
     
      // Jouer le son du trésor
      const treasureSound = document.getElementById('treasureSound');
      treasureSound.play();
    }

    // Déplacer le joueur
    dungeonGrid[playerY][playerX] = 'empty';
    playerX = newX;
    playerY = newY;
    dungeonGrid[playerY][playerX] = 'player';

    if (treasuresCollected === totalTreasures) {
      gameWon();
    }

    moveMonsters(); // Déplacer les monstres après avoir bougé le joueur

    displayGrid(); // Appel à displayGrid() pour actualiser l'affichage
  }
}

// Déplace les monstres dans la grille

function moveMonsters() {
  monsters.forEach((monster) => {
    const directions = [
      { x: 1, y: 0 }, // Droite
      { x: -1, y: 0 }, // Gauche
      { x: 0, y: 1 }, // Bas
      { x: 0, y: -1 } // Haut
    ];

    // Choisissez une direction aléatoire parmi celles disponibles
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    const newX = monster.x + randomDirection.x;
    const newY = monster.y + randomDirection.y;

    // Vérifiez si les nouvelles coordonnées sont valides
    if (
      newX >= 0 &&
      newX < dungeonGrid[0].length &&
      newY >= 0 &&
      newY < dungeonGrid.length
    ) {
      // Si le monstre rencontre le joueur, le jeu est perdu
      if (dungeonGrid[newY][newX] === 'player') {
        gameOver();
        return; // Sortir de la boucle pour éviter les mouvements inutiles
      }

      // Si les nouvelles coordonnées ne sont pas un mur, déplacer le monstre
      if (dungeonGrid[newY][newX] !== 'wall') {
        // Effacez l'emplacement actuel du monstre
        dungeonGrid[monster.y][monster.x] = 'empty';
        
        // Mettez à jour les nouvelles coordonnées du monstre
        monster.x = newX;
        monster.y = newY;

        // Placez le monstre à son nouvel emplacement
        dungeonGrid[newY][newX] = 'monster'; 
      }
    }
  });

  displayGrid(); // Assurez-vous que l'affichage est mis à jour après le déplacement des monstres
}


// Place les monstres initialement dans la grille
function placeMonsters() {
  monsters.forEach((monster) => {
    dungeonGrid[monster.y][monster.x] = 'monster';
  });
}
// Place les trésors initialement dans la grille
function placeTreasures() {
  const availablePositions = [];
  
  dungeonGrid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 'empty') {
        availablePositions.push([y, x]);
      }
    });
  });

  shuffleArray(availablePositions);

  dungeonGrid[availablePositions[0][0]][availablePositions[0][1]] = 'treasure';
  dungeonGrid[availablePositions[1][0]][availablePositions[1][1]] = 'treasure';
  dungeonGrid[availablePositions[2][0]][availablePositions[2][1]] = 'treasure';
}

// Traite la victoire du joueur
function gameWon() {
  
  // Obtenir la référence vers l'élément audio de la victoire
  const victorySound = document.getElementById('victorySound');

  // Jouer le son de victoire
  victorySound.play();
  alert('Vous avez gagné !');
  resetGame();
}
// Traite la défaite du joueur
function gameOver() {
  
  // Joue le son de capture
  const captureSound = document.getElementById('captureSound');
  captureSound.play();

  alert('Terminé ! Vous avez été capturé.');
  resetGame();
}
// Gestionnaire d'événements pour les touches de direction
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
      movePlayer(1, 0);
      break;
  }
});
// Lier les boutons de déplacement aux actions du joueur
document.getElementById('upBtn').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('leftBtn').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('rightBtn').addEventListener('click', () => movePlayer(1, 0));
document.getElementById('downBtn').addEventListener('click', () => movePlayer(0, 1));

// Obtenir la référence vers le bouton "Recommencer"
const restartButton = document.getElementById('restartBtn');

// Ajouter un gestionnaire d'événements au clic sur le bouton "Recommencer"
restartButton.addEventListener('click', resetGame);

// Fonction pour générer la grille initiale avec les monstres et les trésors
function initializeGame() {
  placeMonsters(); // Place les monstres initialement
  placeTreasures(); // Place les trésors initialement
  generateGrid(); // Génère la grille du jeu
}

// Générez la grille initiale
generateGrid();


// Réinitialise le jeu
function resetGame() {
  // Réinitialiser les scores et trésors collectés
  score = 0;
  treasuresCollected = 0;
  updateScore();

  // Réinitialiser la position du joueur à sa position initiale
  dungeonGrid[playerY][playerX] = 'empty';
  playerX = 9;
  playerY = 6;
  dungeonGrid[playerY][playerX] = 'player';

  // Réinitialiser la grille en la vidant
  grid.innerHTML = '';

  // Rétablir les positions initiales des monstres et des trésors
  
  dungeonGrid[3][10] = 'treasure';
  dungeonGrid[6][3] = 'treasure';
  dungeonGrid[8][13] = 'treasure';

  // Générer la nouvelle grille
  generateGrid();

  // Appel à initializeGame() pour remettre en place les monstres et les trésors
  initializeGame();
}
