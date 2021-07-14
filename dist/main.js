/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

var container = document.getElementById("shipContainer");
var rotated = false;
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
    var fleetPlaced = [];
    return {
        name: name,
        fleet: fleet,
        fleetPlaced: fleetPlaced,
        board: board,
        placeFleet: function (coordinates) {
            var count = 10 * coordinates.length;
            if (!rotated &&
                coordinates.some(function (co) { return co % 10 === 0 && co !== coordinates[0]; }))
                return false;
            if (rotated && coordinates[0] + count - 10 > 100)
                return false;
            if (board[coordinates[0]] === -1 ||
                board[coordinates[coordinates.length - 1]] === -1)
                return false;
            if (!rotated) {
                for (var i = coordinates[0]; i < coordinates[coordinates.length - 1] + 1; i += 1) {
                    board[i] = -1;
                }
            }
            if (rotated) {
                for (var i = coordinates[0]; i < coordinates[0] + count; i += 10) {
                    board[i] = -1;
                }
            }
            fleetPlaced.push(coordinates.length);
            console.log(board);
            return true;
        },
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
var player2 = CreateGameBoard("player2");
function rotateShip() {
    if (!container)
        return;
    var ships = container === null || container === void 0 ? void 0 : container.getElementsByClassName("warship");
    var arr = Array.prototype.slice.call(ships);
    container.style.flexDirection =
        container.style.flexDirection === "row" ? "column" : "row";
    arr.forEach(function (ship) {
        if (ship.className === "warship " + ship.id) {
            ship.classList.remove(ship.id);
            ship.classList.add(ship.id + "Rotated");
            rotated = true;
        }
        else {
            ship.classList.remove(ship.id + "Rotated");
            ship.classList.add(ship.id);
            rotated = false;
        }
    });
}
function placeFleetRandom(player) {
    console.log(player.board);
    console.log(player.fleet);
}
function gameStart() {
    if (!checkReady())
        return;
    var shipContainer = document.getElementById("shipContainer");
    var player2Board = document.getElementById("player2Board");
    if (!shipContainer || !player2Board)
        return;
    shipContainer.style.display = "none";
    player2Board.style.display = "flex";
    placeFleetRandom(player2);
}
function markAttack(id) {
    var gridAttackedDOM = document.getElementById(id);
    if (!gridAttackedDOM)
        return;
    gridAttackedDOM.innerText = "•";
    gridAttackedDOM.dataset.id = id;
    gridAttackedDOM.style.color =
        gridAttackedDOM.dataset.id === "-3" ? "red" : "white";
}
function takeTurn(player, e) {
    if (!checkReady())
        return;
    var target = e.target;
    var enemy = player.name === "player1" ? player2 : player1;
    var gridAttacked = enemy.board.findIndex(function (arg) { return arg === parseInt(target.id, 10); });
    enemy.board[gridAttacked] = enemy.board[gridAttacked] === -1 ? -3 : -2;
    markAttack(target.id);
}
var shipID = "";
var currentPosition = "";
function dragstart(e) {
    var _a;
    var target = e.target;
    shipID = target.id;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text", target === null || target === void 0 ? void 0 : target.className);
}
function dropShip(e) {
    var _a;
    var boardTarget = e.currentTarget;
    currentPosition = boardTarget.id;
    var target = e.target;
    var data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text");
    target.className += " " + data;
}
function removeShip(e) {
    if (currentPosition !== "player1MainBoard")
        return;
    var target = e.target;
    target.style.display = "none";
    currentPosition = "";
}
function addListeners() {
    var warships = document.querySelectorAll(".warship");
    var playerBoard = document.querySelector(".mainBoard");
    var AIBoard = document.getElementById("player2Board");
    var AIGrids = AIBoard === null || AIBoard === void 0 ? void 0 : AIBoard.querySelectorAll(".grid");
    var rotateButton = document.querySelector("button");
    var validMove = true;
    warships.forEach(function (warship) {
        return warship.addEventListener("dragstart", dragstart);
    });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("dragover", function (e) { return e.preventDefault(); });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("drop", function (e) {
        var _a, _b;
        var target = e.target;
        var move = player1.placeFleet(getCoordinates(target.id, (_a = player1.fleet[shipID]) === null || _a === void 0 ? void 0 : _a.getLength()));
        if (!move) {
            validMove = false;
            return;
        }
        player1.placeFleet(getCoordinates(target.id, (_b = player1.fleet[shipID]) === null || _b === void 0 ? void 0 : _b.getLength()));
        dropShip(e);
        validMove = true;
    });
    warships.forEach(function (warship) {
        return warship.addEventListener("dragend", function (e) {
            if (!validMove)
                return;
            removeShip(e);
            gameStart();
        });
    });
    AIGrids === null || AIGrids === void 0 ? void 0 : AIGrids.forEach(function (grid) {
        return grid.addEventListener("click", function (e) { return takeTurn(player1, e); });
    });
    rotateButton === null || rotateButton === void 0 ? void 0 : rotateButton.addEventListener("click", rotateShip);
}
addListeners();

/******/ })()
;
//# sourceMappingURL=main.js.map