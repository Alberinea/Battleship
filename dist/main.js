/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

function CreateShip(length) {
    var HP = [];
    var hitCount = 0;
    for (var i = 1; i < length + 1; i += 1) {
        HP.push(i);
    }
    return {
        HP: HP,
        getHitCount: function () {
            return hitCount;
        },
        hit: function (hit) {
            if (hitCount === length)
                return;
            HP[hit] = 0;
            hitCount += 1;
        },
        isSunk: function () {
            if (!HP.some(function (hit) { return hit > 1; }))
                return true;
            return false;
        },
    };
}
function getCoordinates(e, length) {
    var coordinates = [];
    for (var i = 0; i < length; i += 1) {
        coordinates.push(parseInt(e.target.id, 10) + i);
    }
    return coordinates;
}
function printID() {
    var grids = document.querySelectorAll('.grid');
    for (var i = 0; i < grids.length; i += 1) {
        grids[i].id = "" + i;
    }
}
function CreateGameBoard(name) {
    printID();
    var board = Array.from(Array(100).keys());
    var fleet = {
        carrier: CreateShip(5),
        battleship: CreateShip(4),
        cruiser: CreateShip(3),
        submarine: CreateShip(3),
        destroyer: CreateShip(2),
    };
    return {
        name: name,
        fleet: fleet,
        board: board,
        // placeFleet(warships: {}, playerBoard: [], coordinates: number[]) {
        //   fleet.battleship.HP
        // },
        receiveAttack: function () { },
        checkGameOver: function () {
            if (Object.values(fleet).every(function (_a) {
                var isSunk = _a.isSunk;
                return isSunk();
            }))
                return true;
            return false;
        },
    };
}
var player1 = CreateGameBoard('player1');
var player2 = CreateGameBoard('player2');
document
    .querySelectorAll('.grid')
    .forEach(function (grid) { return grid.addEventListener('click', function (e) { return getCoordinates(e, 5); }); });

/******/ })()
;
//# sourceMappingURL=main.js.map