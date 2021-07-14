/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

var shipID = "";
function CreateShip(length) {
    var HP = [];
    var hitCount = 0;
    for (var i = 1; i < length + 1; i += 1) {
        HP.push(i);
    }
    return {
        HP: HP,
        getLength: function () {
            return length;
        },
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
function getCoordinates(id, length) {
    var coordinates = [];
    for (var i = 0; i < length; i += 1) {
        coordinates.push(parseInt(id, 10) + i);
    }
    return coordinates;
}
function printID() {
    var grids = document.querySelectorAll(".grid");
    for (var i = 0; i < grids.length; i += 1) {
        grids[i].id = "" + i;
    }
}
function checkReady() {
    var container = document.getElementById("shipContainer");
    var ships = container === null || container === void 0 ? void 0 : container.querySelectorAll(".warship");
    var arr = Array.prototype.slice.call(ships);
    if (arr.every(function (_a) {
        var display = _a.style.display;
        return display === "none";
    }))
        return true;
    return false;
}
function CreateGameBoard(name) {
    printID();
    var leftSide = Array.from(Array(100).keys());
    var board = name === "player2" ? leftSide.map(function (grid) { return grid + 100; }) : leftSide;
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
        placeFleet: function (coordinates) {
            for (var i = coordinates[0]; i < coordinates[coordinates.length - 1] + 1; i += 1) {
                board[i] = -1;
            }
        },
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
var player1 = CreateGameBoard("player1");
// const player2 = CreateGameBoard('player2');
// function takeTurn({ name }: { name: Player }) {
//   console.log(name);
// }
function gameStart() {
    if (!checkReady())
        return;
    var shipContainer = document.getElementById("shipContainer");
    var player2Board = document.getElementById("player2Board");
    if (!shipContainer || !player2Board)
        return;
    shipContainer.style.display = "none";
    player2Board.style.display = "flex";
}
var warships = document.querySelectorAll(".warship");
var playerBoard = document.querySelector(".mainBoard");
function dragstart(e) {
    var _a;
    var target = e.target;
    shipID = target.id;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text", target === null || target === void 0 ? void 0 : target.className);
}
function dragend(e) {
    var target = e.target;
    target.style.display = "none";
}
function drop(e) {
    var _a;
    var target = e.target;
    var data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text");
    target.className += " " + data;
    return target.id;
}
function addListeners() {
    warships.forEach(function (warship) {
        return warship.addEventListener("dragstart", dragstart);
    });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("dragover", function (e) { return e.preventDefault(); });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("drop", function (e) {
        player1.placeFleet(getCoordinates(drop(e), player1.fleet[shipID].getLength()));
    });
    warships.forEach(function (warship) {
        return warship.addEventListener("dragend", function (e) {
            dragend(e);
            gameStart();
        });
    });
}
addListeners();

/******/ })()
;
//# sourceMappingURL=main.js.map