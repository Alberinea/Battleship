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
            if (board[coordinates[0]] === -1)
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
    var ships = [
        player.fleet.carrier.getLength(),
        player.fleet.battleship.getLength(),
        player.fleet.cruiser.getLength(),
        player.fleet.submarine.getLength(),
        player.fleet.destroyer.getLength(),
    ];
    while (player.fleetPlaced.length !== 5) {
        var coordinates = [];
        var random = Math.floor(Math.random() * 100);
        if (random < 51)
            rotated = true;
        for (var i = 0; i < ships[0]; i += 1) {
            coordinates.push(random + i);
        }
        if (player.placeFleet(coordinates))
            ships.splice(0, 1);
        rotated = false;
    }
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
function markAttack(id, player, grid) {
    var gridAttackedDOM = document.getElementById(id);
    if (!gridAttackedDOM)
        return;
    gridAttackedDOM.innerText = "•";
    gridAttackedDOM.style.color = player.board[grid] === -3 ? "red" : "white";
}
function takeTurn(player, coordinate) {
    var _a;
    if (((_a = document.getElementById(coordinate)) === null || _a === void 0 ? void 0 : _a.innerText) === "•")
        return false;
    var enemy = player.name === "player1" ? player2 : player1;
    var grid = parseInt(coordinate, 10);
    enemy.board[grid] = enemy.board[grid] === -1 ? -3 : -2;
    markAttack(coordinate, enemy, grid);
    return true;
}
function convertEvent(e) {
    var target = e.target;
    return target.id;
}
function playGame(e) {
    if (takeTurn(player1, convertEvent(e)))
        takeTurn(player2, Math.floor(Math.random() * 100).toString());
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
        return grid.addEventListener("click", function (e) { return playGame(e); });
    });
    rotateButton === null || rotateButton === void 0 ? void 0 : rotateButton.addEventListener("click", rotateShip);
}
addListeners();

/******/ })()
;
//# sourceMappingURL=main.js.map