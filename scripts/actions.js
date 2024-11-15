/**
 * @file SokobanGame.js
 * @description Implementerar Sokoban-spelmekaniken inklusive start, reset och spelkontroll.
 */
var H_P = {
  width: 0,
  height: 0,
}
var newgame = true
var currentMap
var maprol
/**
 * Återställer spelet till sin initiala status och laddar om sidan.
 * @function resetGame
 */
function resetGame() {
  localStorage.removeItem('playerPosition')
  localStorage.removeItem('gameMap')
  localStorage.removeItem('moves')
  localStorage.removeItem('mapName')
  localStorage.removeItem('newgame')
  localStorage.removeItem('playerName')
  document.getElementById('menu').style.display = 'block'
  document.getElementById('gamespace').style.display = 'none'
  document.getElementById('banner').style.display = 'none'
  document.getElementById('resetGame').style.display = 'none'
  location.reload()
}
/**
 * Startar spelet med vald karta och validerar spelarens namn.
 * @function startGame
 * @param {string} mapName - Namnet på kartan som ska laddas.
 */
function startGame(mapName) {
  const playerNameInput = document.getElementById('playerNameInput')
  var playerName = playerNameInput.value.trim()
  if (mapName) {
    // Validera namnet innan spelet startar
    if (playerName.length < 3 || playerName.length > 20) {
      alert(
        'Vänligen ange ett giltigt namn (mellan 3 och 20 tecken) för att starta spelet.'
      )
      return
    } else {
      localStorage.setItem('playerName', playerName)
    }
  } else playerName = localStorage.getItem('playerName')
  if (mapName) localStorage.setItem('mapName', mapName)
  else mapName = localStorage.getItem('mapName')
  if (!mapName) return
  if (mapName === 'tileMap01') {
    currentMap = tileMap01
  } else if (mapName === 'tileMap02') {
    currentMap = tileMap02
  }
  loadGameState()

  //loadGameState()
  // Dölj menyn och visa spelområdet
  document.getElementById('menu').style.display = 'none'
  document.getElementById('gamespace').style.display = 'block'
  document.getElementById('banner').style.display = 'block'
  document.getElementById('resetGame').style.display = 'block'
  if (newgame !== 'false') maprol = currentMap.mapGrid
  else maprol[H_P.height][H_P.width] = 'P'
  // Rita upp kartan
  Drawing_map()
  saveGameState()
}
/**
 * Sparar spelets aktuella tillstånd till localStorage.
 * @function saveGameState
 */
function saveGameState() {
  // Spara spelarens position
  localStorage.setItem('playerPosition', JSON.stringify(H_P))

  // Spara kartlayouten
  localStorage.setItem('gameMap', JSON.stringify(maprol))

  // Spara antal drag
  localStorage.setItem('moves', moves)
  localStorage.setItem('newgame', false)
}
/**
 * Laddar spelets tillstånd från localStorage.
 * @function loadGameState
 */
function loadGameState() {
  var mapName = localStorage.getItem('mapName')

  document.getElementById('UserName').innerHTML =
    'Hej ' + localStorage.getItem('playerName')
  var record = localStorage.getItem('record' + mapName)
  if (record)
    document.getElementById('UserName').innerHTML += ' Best record:' + record
  // Ladda spelarens position
  const savedPlayerPosition = localStorage.getItem('playerPosition')
  if (savedPlayerPosition) {
    H_P = JSON.parse(savedPlayerPosition)
  }

  const newgamest = localStorage.getItem('newgame')
  if (newgamest) {
    newgame = newgamest
  } else {
    newgame = true
  }
  // Ladda kartlayouten
  const savedGameMap = localStorage.getItem('gameMap')
  if (savedGameMap) {
    maprol = JSON.parse(savedGameMap)
  } else {
    maprol = currentMap.mapGrid
  }

  // Ladda antal drag
  const savedMoves = localStorage.getItem('moves')
  if (savedMoves) {
    moves = parseInt(savedMoves, 10)
  } else {
    moves = 0
  }
}

let Gtags = []
var moves = 0
function displayDate() {}
/**
 * Ritar upp spelkartan baserat på den aktuella kartlayouten.
 * @function Drawing_map
 */
function Drawing_map() {
  var gameTable = document.getElementById('gametable')
  gameTable.innerHTML = ''
  var height = currentMap.height
  var lengt = currentMap.width
  var element = document.getElementById('win')
  element.innerText = moves + '  moves'
  if (newgame === 'false') console.log('tess')
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < lengt; j++) {
      var tag = document.createElement('div')
      tag.id = 'i' + i + '_' + j
      if (maprol[i][j] != ' ') {
        if (maprol[i][j] == 'G') {
          Gtags.push(tag.id)
        }
        tag.className = maprol[i][j]
        if (maprol[i][j] == 'P') {
          H_P.height = i
          H_P.width = j
        }
      } else tag.className = 'Empty'
      var element = document.getElementById('gametable')
      element.appendChild(tag)
    }
  }
}
/**
 * Kontrollerar om en rörelse är giltig baserat på spelarens aktuella position och tangenttryckning.
 * @function isvalid
 * @param {string} key - Tangenten som trycktes ned, t.ex. "ArrowUp", "ArrowDown", "ArrowLeft", eller "ArrowRight".
 * @returns {boolean} - Returnerar true om rörelsen är giltig, annars false.
 */
function isvalid(key) {
  let act = false
  switch (key) {
    case 'ArrowUp':
      if (maprol[H_P.height - 1][H_P.width] != 'W') act = true
      if (maprol[H_P.height - 1][H_P.width] == 'B') {
        act = false
        Movebox(key)
      }

      break
    case 'ArrowDown':
      if (maprol[H_P.height + 1][H_P.width] != 'W') act = true
      if (maprol[H_P.height + 1][H_P.width] == 'B') {
        act = false
        Movebox(key)
      }

      break
    case 'ArrowLeft':
      if (maprol[H_P.height][H_P.width - 1] != 'W') act = true
      if (maprol[H_P.height][H_P.width - 1] == 'B') {
        act = false
        Movebox(key)
      }

      break
    case 'ArrowRight':
      if (maprol[H_P.height][H_P.width + 1] != 'W') act = true
      if (maprol[H_P.height][H_P.width + 1] == 'B') {
        act = false
        Movebox(key)
      }

      break
    default:
      act = false
  }
  if (act) moves++
  return act
}
/**
 * Flyttar en låda i den riktning som spelaren angav.
 * @function Movebox
 * @param {string} key - Tangenten som indikerar riktningen, t.ex. "ArrowUp", "ArrowDown", "ArrowLeft", eller "ArrowRight".
 */
function Movebox(key) {
  const directions = {
    ArrowUp: { dx: 0, dy: -1 },
    ArrowDown: { dx: 0, dy: 1 },
    ArrowLeft: { dx: -1, dy: 0 },
    ArrowRight: { dx: 1, dy: 0 },
  }

  if (!(key in directions)) return // Kontrollera att en giltig tangenttryckning gjordes

  const { dx, dy } = directions[key]
  const newHeight = H_P.height + dy
  const newWidth = H_P.width + dx
  const nextHeight = H_P.height + 2 * dy
  const nextWidth = H_P.width + 2 * dx

  // Kontrollera att nästa position för blocket inte är en vägg eller ett annat block
  if (
    maprol[nextHeight][nextWidth][0] !== 'W' &&
    maprol[nextHeight][nextWidth][0] !== 'B'
  ) {
    const moveSound = new Audio('sounds/movebox.mp3') // Ladda ljudfilen
    moveSound.play() // Spela upp ljudet
    moves++

    const currentId = `i${H_P.height}_${H_P.width}`
    const targetId = `i${newHeight}_${newWidth}`
    const beyondId = `i${nextHeight}_${nextWidth}`

    // Hämta HTML-element
    const currentElement = document.getElementById(currentId)
    const targetElement = document.getElementById(targetId)
    const beyondElement = document.getElementById(beyondId)

    // Uppdatera elementens klasser för att flytta spelaren och blocket
    currentElement.className = 'Empty'
    targetElement.className = 'P'
    beyondElement.className = maprol[newHeight][newWidth] === 'G' ? 'G' : 'B'

    // Uppdatera spelbrädan
    maprol[H_P.height][H_P.width] = ' '
    maprol[newHeight][newWidth] = ' '
    maprol[nextHeight][nextWidth] = 'B'

    // Uppdatera spelarens position
    H_P.height = newHeight
    H_P.width = newWidth
  }
  saveGameState()
}
/**
 * Flyttar spelaren i den riktning som angavs av användaren.
 * @function move
 * @param {string} key - Tangenten som angav riktningen, t.ex. "ArrowUp", "ArrowDown", "ArrowLeft", eller "ArrowRight".
 */
function move(key) {
  var x = {
    width: 0,
    height: 0,
  }
  var x2 = {
    width: 0,
    height: 0,
  }

  if (isvalid(key)) {
    if (key == 'ArrowUp') {
      x.height = H_P.height - 1
      x.width = H_P.width
      x2.height = H_P.height
      x2.width = H_P.width
      H_P.height -= 1
    }
    if (key == 'ArrowDown') {
      x.height = H_P.height + 1
      x.width = H_P.width
      x2.height = H_P.height
      x2.width = H_P.width
      H_P.height += 1
    }
    if (key == 'ArrowLeft') {
      x.height = H_P.height
      x.width = H_P.width - 1
      x2.height = H_P.height
      x2.width = H_P.width
      H_P.width -= 1
    }
    if (key == 'ArrowRight') {
      x.height = H_P.height
      x.width = H_P.width + 1
      x2.height = H_P.height
      x2.width = H_P.width
      H_P.width += 1
    }
    var element = document.getElementById('i' + x.height + '_' + x.width)
    var element2 = document.getElementById('i' + x2.height + '_' + x2.width)
    element.className = 'P'
    element2.className = 'Empty'
    maprol[x2.height][x2.width] = ' '
    element.append()
    element2.append()
  }
  saveGameState()
}

window.onload = startGame()
window.on = displayDate()
document.addEventListener(
  'keydown',
  (event) => {
    var name = event.key
    const newgamest = localStorage.getItem('newgame')
    if (newgamest === 'false') {
      move(event.key)
      Gol()
      var element = document.getElementById('win')
      element.innerText = moves + '  moves'
    }
  },
  false
)
/**
 * Kontrollerar om spelaren har vunnit spelet och visar ett vinstmeddelande vid behov.
 * @function Gol
 */
function Gol() {
  let winner = true
  for (let i = 0; i < Gtags.length; i++) {
    element = document.getElementById(Gtags[i])
    if (element.className != 'G') {
      switch (element.className) {
        case 'Empty':
          element.className = 'G'
          break
        case 'B':
          element.className = 'GD'
          break
        case 'P':
          element.className = 'PD'
          break
        default:
        // code block
      }
    }
  }
  for (let i = 0; i < Gtags.length; i++) {
    element = document.getElementById(Gtags[i])
    if (element.className != 'GD') {
      winner = false
    }
  }
  if (winner) {
    alert('you won!! by' + moves + ' moves')
    var mapName = localStorage.getItem('mapName')
    var record = localStorage.getItem('record' + mapName)
    if (!record || record > moves)
      localStorage.setItem('record' + mapName, moves)
  }
}
window.onscroll = () => {
  window.scroll(0, 0)
}
