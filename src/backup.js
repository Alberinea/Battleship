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
