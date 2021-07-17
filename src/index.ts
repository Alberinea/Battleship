type Player = "player1" | "player2";

const container = document.getElementById("shipContainer");

let rotated = false;

const previousMoves: any[] = [];

function CreateShip(length: number, shipName: string) {
  let HP = length;
  const name = shipName;
  return {
    getName(): string {
      return name;
    },
    getHP(): number {
      return HP;
    },
    hit(): void {
      HP -= 1;
    },
    isSunk(): boolean {
      if (HP <= 0) return true;
      return false;
    },
  };
}

function getCoordinates(id: string, length: number) {
  const coordinates = [];
  const spot = parseInt(id, 10);
  if (!rotated) {
    for (let i = 0; i < length; i += 1) {
      coordinates.push(spot + i);
    }
  }
  if (rotated) {
    for (let i = spot; i < spot + length * 10; i += 10) {
      coordinates.push(i);
    }
  }
  return coordinates;
}

function changeUI(text: string) {
  const UI = document.querySelector("h2");
  UI.innerText = text;
}

function printID(): void {
  const grids = document.querySelectorAll(".grid");
  for (let i = 0; i < grids.length; i += 1) {
    grids[i].id = `${i}`;
  }
}

function checkReady() {
  const ships = container?.querySelectorAll(".warship");
  const arr = Array.prototype.slice.call(ships);
  if (arr.every((ship: HTMLElement) => ship.style.display === "none"))
    return true;
  return false;
}

function CreateGameBoard(name: Player) {
  printID();
  const leftSide = Array.from(Array(100).keys());
  const boardInt =
    name === "player2" ? leftSide.map((grid) => grid + 100) : leftSide;
  const board = boardInt.map((arg) => arg.toString());
  const fleet = {
    carrier: CreateShip(5, "carrier"),
    battleship: CreateShip(4, "battleship"),
    cruiser: CreateShip(3, "cruiser"),
    submarine: CreateShip(3, "submarine"),
    destroyer: CreateShip(2, "destroyer"),
  };
  const fleetPlaced: number[] = [];
  return {
    name,
    fleet,
    fleetPlaced,
    board,
    placeFleet(coordinates: number[], shipName: string): boolean {
      const count = 10 * coordinates.length;
      if (
        !rotated &&
        coordinates.some((co) => co % 10 === 0 && co !== coordinates[0])
      )
        return false;
      if (rotated && coordinates[0] + count - 10 > 100) return false;

      if (coordinates.some((co) => Number.isNaN(parseInt(board[co], 10))))
        return false;

      coordinates.forEach((co) => {
        board[co] = shipName;
      });
      fleetPlaced.push(coordinates.length);
      return true;
    },
    gameOver(): boolean {
      if (Object.values(fleet).every(({ isSunk }) => isSunk())) return true;
      return false;
    },
  };
}

const player1 = CreateGameBoard("player1");
const player2 = CreateGameBoard("player2");

function rotateShip() {
  if (!container) return;
  const ships = container?.getElementsByClassName("warship");
  const arr = Array.prototype.slice.call(ships);
  container.style.flexDirection =
    container.style.flexDirection === "row" ? "column" : "row";
  arr.forEach((ship: HTMLElement) => {
    if (ship.className === `warship ${ship.id}`) {
      ship.classList.remove(ship.id);
      ship.classList.add(`${ship.id}Rotated`);
      rotated = true;
    } else {
      ship.classList.remove(`${ship.id}Rotated`);
      ship.classList.add(ship.id);
      rotated = false;
    }
  });
}

function placeFleetRandom(player: any) {
  const fleet = { ...player.fleet };
  while (player.fleetPlaced.length !== 5) {
    const first: any = Object.values(fleet)[0];
    const random = Math.floor(Math.random() * 100);
    if (random < 51) rotated = true;
    if (
      player.placeFleet(
        getCoordinates(random.toString(), first.getHP()),
        first.getName()
      )
    ) {
      delete fleet[Object.keys(fleet)[0]];
    }
    rotated = false;
  }
}

function gameStart() {
  if (!checkReady()) return;
  changeUI("Game starts");
  const shipContainer = document.getElementById("shipContainer");
  const player2Board = document.getElementById("player2Board");
  if (!shipContainer || !player2Board) return;
  shipContainer.style.display = "none";
  player2Board.style.display = "flex";
  placeFleetRandom(player2);
}

function markAttack(id: string, player: any, grid: number) {
  const gridAttackedDOM = document.getElementById(id);
  if (!gridAttackedDOM) return;
  gridAttackedDOM.innerText = "•";
  gridAttackedDOM.style.color = Number.isNaN(parseInt(player.board[grid], 10))
    ? "red"
    : "white";
}

function changeLife(isSunk: boolean, { name }: { name: string }) {
  let life = <HTMLElement>(
    document.getElementById(`${name}SunkShip`)?.firstElementChild
  );
  while (life?.style.color === "black")
    life = <HTMLElement>life?.nextElementSibling;
  if (isSunk) {
    life.style.color = "black";
  }
}

function checkSunk(player: any, shipName: string): boolean {
  if (player.fleet[shipName].isSunk()) return true;
  return false;
}

function checkGameOver(player: any) {
  const enemy = player.name === "player1" ? player2 : player1;
  if (player.gameOver()) {
    changeUI(`${enemy.name} wins!`);
    document.getElementById("content").style.display = "none";
  }
}

function displayBattleUI(player: any, grid: number) {
  if (checkSunk(player, player.board[grid]))
    changeUI(`${player.name}'s ${[player.board[grid]]} sinks`);
  else changeUI(`${player.name}'s ${[player.board[grid]]} gets hit`);
}

function checkHit(player: any, grid: number) {
  if (Number.isNaN(parseInt(player.board[grid], 10))) {
    player.fleet[player.board[grid]].hit();
    displayBattleUI(player, grid);
    changeLife(checkSunk(player, player.board[grid]), player);
    player.board[grid] = "-3";
    checkGameOver(player);
  } else {
    player.board[grid] = "-2";
  }
  return player.board[grid];
}

function takeTurn(
  player: Record<string, unknown>,
  coordinate: string
): boolean {
  if (document.getElementById(coordinate)?.innerText === "•") return false;
  const enemy = player.name === "player1" ? player2 : player1;
  const grid =
    player.name === "player1"
      ? parseInt(coordinate, 10) - 100
      : parseInt(coordinate, 10);
  markAttack(coordinate, enemy, grid);

  const moves = { index: 0, result: 0, ship: "" };
  moves.ship = enemy.board[grid];
  moves.result = checkHit(enemy, grid);
  moves.index = grid;
  previousMoves.push(moves);
  return true;
}

function convertEvent(e: Event) {
  const target = e.target as HTMLElement;
  const coordinates = parseInt(target.id, 10);
  return coordinates.toString();
}

let AIHit = false;
let missRight = false;

function AIPlay() {
  let random = Math.floor(Math.random() * 100);
  const board = [...player1.board];
  while (board[random] === "-2" || board[random] === "-3") {
    random = Math.floor(Math.random() * 100);
  }
  if (previousMoves.length < 2) return random.toString();

  const lastSpot = previousMoves[previousMoves.length - 2];
  let move;
  let nextMoveX = lastSpot.index + 1;
  let backMoveX = lastSpot.index - 2;
  let topMoveY = lastSpot.index - 11;
  let bottomMoveY = lastSpot.index - 2;

  while (board[nextMoveX] === "-2" || board[nextMoveX] === "-3") {
    if (nextMoveX > 0 && nextMoveX < 100) nextMoveX += 1;
    else nextMoveX -= 1;
  }
  while (board[backMoveX] === "-2" || board[backMoveX] === "-3") {
    if (backMoveX > 0 && backMoveX < 100) backMoveX -= 1;
    else backMoveX += 1;
  }
  while (board[topMoveY] === "-2" || board[topMoveY] === "-3") {
    if (topMoveY > 0 && topMoveY < 100) topMoveY -= 10;
    else topMoveY += 10;
  }
  while (board[bottomMoveY] === "-2" || board[bottomMoveY] === "-3") {
    if (bottomMoveY > 0 && bottomMoveY < 100) bottomMoveY += 10;
    else bottomMoveY -= 10;
  }

  switch (true) {
    case player1.fleet[lastSpot.ship]?.isSunk():
      AIHit = false;
      missRight = false;
      move = random;
      break;
    case lastSpot.result === "-3" && !AIHit:
      move = nextMoveX;
      AIHit = true;
      break;
    case lastSpot.result === "-3" && AIHit && !missRight:
      move = nextMoveX;
      break;
    case lastSpot.result === "-2" && AIHit && !missRight:
      move = backMoveX;
      missRight = true;
      break;
    case lastSpot.result === "-3" && AIHit && missRight:
      move = backMoveX + 1;
      break;
    default:
      move = random;
      break;
  }
  return move.toString();
}

function playGame(e: Event) {
  if (takeTurn(player1, convertEvent(e))) takeTurn(player2, AIPlay());
}

let shipID = "";
let currentPosition = "";

function dragstart(e: DragEvent) {
  const target = e.target as HTMLElement;
  shipID = target.id;
  e.dataTransfer?.setData("text", target?.className);
}

function dropShip(e: DragEvent) {
  const boardTarget = e.currentTarget as HTMLElement;
  currentPosition = boardTarget.id;

  const target = e.target as HTMLElement;
  const data = e.dataTransfer?.getData("text");
  target.className += ` ${data}`;
}

function removeShip(e: DragEvent) {
  if (currentPosition !== "player1MainBoard") return;
  const target = e.target as HTMLElement;
  target.style.display = "none";
  currentPosition = "";
}

function addListeners(): void {
  const warships = document.querySelectorAll<HTMLElement>(".warship");
  const playerBoard = document.querySelector<HTMLElement>(".mainBoard");
  const AIBoard = document.getElementById("player2Board");
  const AIGrids = AIBoard?.querySelectorAll(".grid");
  const rotateButton = document.querySelector("button");
  let validMove = true;

  warships.forEach((warship) =>
    warship.addEventListener("dragstart", dragstart)
  );
  playerBoard?.addEventListener("dragover", (e) => e.preventDefault());
  playerBoard?.addEventListener("drop", (e) => {
    const target = e.target as HTMLElement;
    const move = player1.placeFleet(
      getCoordinates(target.id, player1.fleet[shipID]?.getHP()),
      shipID
    );
    if (!move) {
      validMove = false;
      return;
    }
    dropShip(e);
    validMove = true;
  });
  warships.forEach((warship) =>
    warship.addEventListener("dragend", (e) => {
      if (!validMove) return;
      removeShip(e);
      gameStart();
    })
  );
  AIGrids?.forEach((grid) =>
    grid.addEventListener("click", (e) => playGame(e))
  );
  rotateButton?.addEventListener("click", rotateShip);
}

addListeners();

// TODO add complex AI
// TODO add restart
// TODO add better ship model and fix mark bug when a ship gets hit
// TODO add delay to AI and remove player 1's click
// TODO add delay to text
