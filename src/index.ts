import drop from './dom';

type Player = 'player1' | 'player2';

function CreateShip(length: number) {
  const HP: number[] = [];
  let hitCount = 0;
  for (let i = 1; i < length + 1; i += 1) {
    HP.push(i);
  }
  return {
    HP,
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

function getCoordinates(e: any, length: number) {
  const coordinates = [];
  for (let i = 0; i < length; i += 1) {
    coordinates.push(parseInt(e.target.id, 10) + i);
  }
  return coordinates;
}

function printID(): void {
  const grids = document.querySelectorAll('.grid');
  for (let i = 0; i < grids!.length; i += 1) {
    grids![i].id = `${i}`;
  }
}

function CreateGameBoard(name: Player) {
  printID();
  const board = Array.from(Array(100).keys());
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
    // placeFleet(warships: {}, playerBoard: [], coordinates: number[]) {
    //   fleet.battleship.HP
    // },
    receiveAttack() {},
    checkGameOver(): boolean {
      if (Object.values(fleet).every(({ isSunk }) => isSunk())) return true;
      return false;
    },
  };
}

const player1 = CreateGameBoard('player1');
// const player2 = CreateGameBoard('player2');
console.log(player1);
document
  .querySelectorAll('.grid')
  .forEach((grid) => grid.addEventListener('click', (e) => getCoordinates(e, 5)));

drop();
