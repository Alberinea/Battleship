type Player = "player1" | "player2";

let shipID = "";

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
  const container = document.getElementById("shipContainer");
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
  return {
    name,
    fleet,
    board,
    placeFleet(coordinates: number[]) {
      for (
        let i = coordinates[0];
        i < coordinates[coordinates.length - 1] + 1;
        i += 1
      ) {
        board[i] = -1;
      }
    },
    receiveAttack() {},
    checkGameOver(): boolean {
      if (Object.values(fleet).every(({ isSunk }) => isSunk())) return true;
      return false;
    },
  };
}

const player1 = CreateGameBoard("player1");
// const player2 = CreateGameBoard('player2');

// function takeTurn({ name }: { name: Player }) {
//   console.log(name);
// }

function gameStart() {
  if (!checkReady()) return;
  const shipContainer = document.getElementById("shipContainer");
  const player2Board = document.getElementById("player2Board");
  if (!shipContainer || !player2Board) return;
  shipContainer.style.display = "none";
  player2Board.style.display = "flex";
}

const warships = document.querySelectorAll<HTMLElement>(".warship");
const playerBoard = document.querySelector<HTMLElement>(".mainBoard");

function dragstart(e: DragEvent) {
  const target = e.target as HTMLElement;
  shipID = target.id;
  e.dataTransfer?.setData("text", target?.className);
}

function dragend(e: DragEvent) {
  const target = e.target as HTMLElement;
  target.style.display = "none";
}

function drop(e: DragEvent): string {
  const target = e.target as HTMLElement;
  const data = e.dataTransfer?.getData("text");
  target.className += ` ${data}`;
  return target.id;
}

function addListeners(): void {
  warships.forEach((warship) =>
    warship.addEventListener("dragstart", dragstart)
  );
  playerBoard?.addEventListener("dragover", (e) => e.preventDefault());
  playerBoard?.addEventListener("drop", (e) => {
    player1.placeFleet(
      getCoordinates(drop(e), player1.fleet[shipID].getLength())
    );
  });
  warships.forEach((warship) =>
    warship.addEventListener("dragend", (e) => {
      dragend(e);
      gameStart();
    })
  );
}

addListeners();
