type Player = "player1" | "player2";

const container = document.getElementById("shipContainer");

let rotated = false;

function CreateShip(length: number) {
  const HP: number[] = [];
  let hitCount = 0;
  for (let i = 1; i < length + 1; i += 1) {
    HP.push(i);
  }
  return {
    HP,
    getLength(): number {
      return length;
    },
    getHitCount(): number {
      return hitCount;
    },
    hit(hit: number): void {
      if (hitCount === length) return;
      HP[hit] = 0;
      hitCount += 1;
    },
    isSunk(): boolean {
      if (!HP.some((hit) => hit > 1)) return true;
      return false;
    },
  };
}

function getCoordinates(id: string, length: number) {
  const coordinates = [];
  for (let i = 0; i < length; i += 1) {
    coordinates.push(parseInt(id, 10) + i);
  }
  return coordinates;
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
  if (arr.every(({ style: { display } }) => display === "none")) return true;
  return false;
}

function CreateGameBoard(name: Player) {
  printID();
  const leftSide = Array.from(Array(100).keys());
  const board =
    name === "player2" ? leftSide.map((grid) => grid + 100) : leftSide;
  const fleet = {
    carrier: CreateShip(5),
    battleship: CreateShip(4),
    cruiser: CreateShip(3),
    submarine: CreateShip(3),
    destroyer: CreateShip(2),
  };
  const fleetPlaced: number[] = [];
  return {
    name,
    fleet,
    fleetPlaced,
    board,
    placeFleet(coordinates: number[]): boolean {
      const count = 10 * coordinates.length;
      if (
        !rotated &&
        coordinates.some((co) => co % 10 === 0 && co !== coordinates[0])
      )
        return false;
      if (rotated && coordinates[0] + count - 10 > 100) return false;
      if (
        board[coordinates[0]] === -1 ||
        board[coordinates[coordinates.length - 1]] === -1
      )
        return false;
      if (!rotated) {
        for (
          let i = coordinates[0];
          i < coordinates[coordinates.length - 1] + 1;
          i += 1
        ) {
          board[i] = -1;
        }
      }
      if (rotated) {
        for (let i = coordinates[0]; i < coordinates[0] + count; i += 10) {
          board[i] = -1;
        }
      }
      fleetPlaced.push(coordinates.length);
      console.log(board);
      return true;
    },
    checkGameOver(): boolean {
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

function placeFleetRandom(player: Record<string, unknown>) {
  console.log(player.board);
  console.log(player.fleet);
}

function gameStart() {
  if (!checkReady()) return;
  const shipContainer = document.getElementById("shipContainer");
  const player2Board = document.getElementById("player2Board");
  if (!shipContainer || !player2Board) return;
  shipContainer.style.display = "none";
  player2Board.style.display = "flex";
  placeFleetRandom(player2);
}

function markAttack(id: string) {
  const gridAttackedDOM = document.getElementById(id);
  if (!gridAttackedDOM) return;
  gridAttackedDOM.innerText = "•";
  gridAttackedDOM.dataset.id = id;
  gridAttackedDOM.style.color =
    gridAttackedDOM.dataset.id === "-3" ? "red" : "white";
}

function takeTurn(player: Record<string, unknown>, e: Event) {
  if (!checkReady()) return;
  const target = e.target as HTMLElement;
  const enemy = player.name === "player1" ? player2 : player1;
  const gridAttacked = enemy.board.findIndex(
    (arg) => arg === parseInt(target.id, 10)
  );
  enemy.board[gridAttacked] = enemy.board[gridAttacked] === -1 ? -3 : -2;
  markAttack(target.id);
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
      getCoordinates(target.id, player1.fleet[shipID]?.getLength())
    );
    if (!move) {
      validMove = false;
      return;
    }
    player1.placeFleet(
      getCoordinates(target.id, player1.fleet[shipID]?.getLength())
    );
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
    grid.addEventListener("click", (e) => takeTurn(player1, e))
  );
  rotateButton?.addEventListener("click", rotateShip);
}

addListeners();
