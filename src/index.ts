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
    fullHeal() {
      HP = length;
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
      ship.style.margin = "10px";
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
    if (!first) return;
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
  const shipContainer = document.getElementById("shipContainer");
  const player2Board = document.getElementById("player2Board");
  if (!shipContainer || !player2Board) return;
  shipContainer.style.display = "none";
  player2Board.style.display = "flex";
  placeFleetRandom(player2);
  changeUI("Game starts");
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
    document.getElementById("restart").style.display = "block";
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

  if (player === player2) {
    const moves = { index: 0, result: 0, ship: "" };
    moves.ship = enemy.board[grid];
    moves.result = checkHit(enemy, grid);
    moves.index = grid;
    previousMoves.push(moves);
  } else {
    checkHit(enemy, grid);
  }
  return true;
}

function convertEvent(e: Event) {
  const target = e.target as HTMLElement;
  const coordinates = parseInt(target.id, 10);
  return coordinates.toString();
}

let hunt = false;

function AIPlay() {
  const board = [...player1.board];
  let random = Math.floor(Math.random() * 100);
  let randomEven = random;
  while (randomEven % 2 === 1) {
    randomEven = Math.floor(Math.random() * 100);
    if (board[randomEven] === "-2" || board[randomEven] === "-3")
      randomEven = Math.floor(Math.random() * 100);
  }
  let move;

  if (previousMoves.length < 1) return random;
  if (previousMoves.length < 2 && !hunt) return random;

  const l1Spot = previousMoves[previousMoves.length - 1];
  let moveRight = l1Spot.index + 1;

  if (!hunt && l1Spot.result === "-3") {
    move = moveRight;
    hunt = true;
    if (previousMoves.length < 2) return move.toString();
  }

  const l2Spot = previousMoves[previousMoves.length - 2];

  let moveLeft = l2Spot.index - 1;
  let moveTop = l2Spot.index - 9;
  let moveBottom = l2Spot.index + 11;
  let stopRight = false;
  let stopLeft = false;
  let stopTop = false;
  let stopBottom = false;

  while (board[moveRight] === "-2" || board[moveRight] === "-3") {
    if (!stopRight) moveRight += 1;
    if (moveRight % 10 === 0) stopRight = true;
    if (stopRight) moveRight += 1;
  }
  while (board[moveLeft] === "-2" || board[moveLeft] === "-3") {
    if (!stopLeft) moveLeft -= 1;
    if (moveLeft % 10 === 0) stopLeft = true;
    if (stopLeft) moveLeft += 1;
  }
  while (board[moveTop] === "-2" || board[moveTop] === "-3") {
    if (!stopTop) moveTop -= 10;
    if (moveTop < 0) stopTop = true;
    if (stopTop) moveTop += 10;
    if (moveTop > 100) break;
  }
  while (board[moveBottom] === "-2" || board[moveBottom] === "-3") {
    if (!stopBottom) moveBottom += 10;
    if (moveBottom > 100) stopBottom = true;
    if (stopBottom) moveBottom -= 10;
    if (moveBottom < 0) break;
  }

  if (player1.fleet[l1Spot.ship]?.isSunk()) {
    move = random;
    hunt = false;
  } else if (hunt && l1Spot.result === "-3" && l2Spot.result === "-3") {
    if (l1Spot.index - l2Spot.index === 10) move = l1Spot.index + 10;
    if (l1Spot.index - l2Spot.index === -10) move = l1Spot.index - 10;
    if (l1Spot.index - l2Spot.index === 1) move = l1Spot.index + 1;
    if (l1Spot.index - l2Spot.index === -1) move = l1Spot.index - 1;
  } else if (
    hunt &&
    l1Spot.result === "-2" &&
    l2Spot.result === "-2" &&
    previousMoves[previousMoves.length - 3].result === "-2"
  ) {
    move = moveBottom;
  } else if (hunt && l1Spot.result === "-2" && l2Spot.result === "-2") {
    move = moveTop;
  } else if (hunt && l1Spot.result === "-2") {
    move = moveLeft;
  } else if (!hunt && l1Spot.result === "-2") move = random;

  if (!move || l1Spot.index === move || move < 0 || move > 100) {
    while (board[random] === "-2" || board[random] === "-3") {
      random = Math.floor(Math.random() * 100);
    }
    move = random;
    console.log("random");
  }

  return move.toString();
}

function playGame(e: Event) {
  if (takeTurn(player1, convertEvent(e))) takeTurn(player2, AIPlay());
}

function restart() {
  for (let i = 0; i < player1.board.length; i += 1) {
    player1.board[i] = i.toString();
    player2.board[i] = (i + 100).toString();
  }
  Object.values(player1.fleet).forEach((ship) => ship.fullHeal());
  Object.values(player2.fleet).forEach((ship) => ship.fullHeal());
  player1.fleetPlaced = [];
  player2.fleetPlaced = [];

  document.querySelectorAll(".grid").forEach((grid: HTMLElement) => {
    grid.className = "grid";
    grid.style.color = "none";
    grid.innerText = "";
  });
  document.querySelectorAll(".warship").forEach((ship: HTMLElement) => {
    ship.style.display = "block";
  });
  document.querySelectorAll(".life").forEach((life: HTMLElement) => {
    life.style.color = "red";
  });

  if (rotated) rotateShip();
  changeUI("Place your ships");
  document.getElementById("content").style.display = "flex";
  document.getElementById("shipContainer").style.display = "flex";
  document.getElementById("player2Board").style.display = "none";
  document.getElementById("restart").style.display = "none";
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
  const restartButton = document.getElementById("restart");
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
  restartButton?.addEventListener("click", restart);
}

addListeners();

// TODO fix AI
