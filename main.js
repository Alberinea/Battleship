/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function() {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var container = document.getElementById("shipContainer");
var rotated = false;
var previousMoves = [];
function CreateShip(length, shipName) {
    var HP = length;
    var name = shipName;
    return {
        getName: function () {
            return name;
        },
        getHP: function () {
            return HP;
        },
        fullHeal: function () {
            HP = length;
        },
        hit: function () {
            HP -= 1;
        },
        isSunk: function () {
            if (HP <= 0)
                return true;
            return false;
        },
    };
}
function getCoordinates(id, length) {
    var coordinates = [];
    var spot = parseInt(id, 10);
    if (!rotated) {
        for (var i = 0; i < length; i += 1) {
            coordinates.push(spot + i);
        }
    }
    if (rotated) {
        for (var i = spot; i < spot + length * 10; i += 10) {
            coordinates.push(i);
        }
    }
    return coordinates;
}
function changeUI(text) {
    var UI = document.querySelector("h2");
    UI.innerText = text;
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
    if (arr.every(function (ship) { return ship.style.display === "none"; }))
        return true;
    return false;
}
function CreateGameBoard(name) {
    printID();
    var leftSide = Array.from(Array(100).keys());
    var boardInt = name === "player2" ? leftSide.map(function (grid) { return grid + 100; }) : leftSide;
    var board = boardInt.map(function (arg) { return arg.toString(); });
    var fleet = {
        carrier: CreateShip(5, "carrier"),
        battleship: CreateShip(4, "battleship"),
        cruiser: CreateShip(3, "cruiser"),
        submarine: CreateShip(3, "submarine"),
        destroyer: CreateShip(2, "destroyer"),
    };
    var fleetPlaced = [];
    return {
        name: name,
        fleet: fleet,
        fleetPlaced: fleetPlaced,
        board: board,
        placeFleet: function (coordinates, shipName) {
            var count = 10 * coordinates.length;
            if (!rotated &&
                coordinates.some(function (co) { return co % 10 === 0 && co !== coordinates[0]; })) {
                return false;
            }
            if (rotated && coordinates[0] + count - 10 > 100)
                return false;
            if (coordinates.some(function (co) { return Number.isNaN(parseInt(board[co], 10)); }))
                return false;
            if (coordinates.some(function (co) { var _a; return ((_a = document.getElementById(co.toString())) === null || _a === void 0 ? void 0 : _a.innerText) === "•"; }))
                return false;
            coordinates.forEach(function (co) {
                board[co] = shipName;
            });
            fleetPlaced.push(coordinates.length);
            return true;
        },
        gameOver: function () {
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
            ship.style.margin = "10px";
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
    var fleet = __assign({}, player.fleet);
    while (player.fleetPlaced.length !== 5) {
        var first = Object.values(fleet)[0];
        if (!first)
            return;
        var random = Math.floor(Math.random() * 100);
        if (random < 51)
            rotated = true;
        if (player.placeFleet(getCoordinates(random.toString(), first.getHP()), first.getName())) {
            delete fleet[Object.keys(fleet)[0]];
        }
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
    changeUI("Game starts");
}
function markAttack(id, player, grid) {
    var gridAttackedDOM = document.getElementById(id);
    if (!gridAttackedDOM)
        return;
    gridAttackedDOM.innerText = "•";
    gridAttackedDOM.style.color = Number.isNaN(parseInt(player.board[grid], 10))
        ? "red"
        : "white";
}
function changeLife(isSunk, _a) {
    var _b;
    var name = _a.name;
    var life = ((_b = document.getElementById(name + "SunkShip")) === null || _b === void 0 ? void 0 : _b.firstElementChild);
    while ((life === null || life === void 0 ? void 0 : life.style.color) === "black")
        life = life === null || life === void 0 ? void 0 : life.nextElementSibling;
    if (isSunk) {
        life.style.color = "black";
    }
}
function checkSunk(player, shipName) {
    if (player.fleet[shipName].isSunk())
        return true;
    return false;
}
function checkGameOver(player) {
    var enemy = player.name === "player1" ? player2 : player1;
    if (player.gameOver()) {
        changeUI(enemy.name + " wins!");
        document.getElementById("content").style.display = "none";
        document.getElementById("restart").style.display = "block";
    }
}
function displayBattleUI(player, grid) {
    if (checkSunk(player, player.board[grid]))
        changeUI(player.name + "'s " + [player.board[grid]] + " sinks");
    else
        changeUI(player.name + "'s " + [player.board[grid]] + " gets hit");
}
function checkHit(player, grid) {
    if (Number.isNaN(parseInt(player.board[grid], 10))) {
        player.fleet[player.board[grid]].hit();
        displayBattleUI(player, grid);
        changeLife(checkSunk(player, player.board[grid]), player);
        player.board[grid] = "-3";
        checkGameOver(player);
    }
    else {
        player.board[grid] = "-2";
    }
    return player.board[grid];
}
function takeTurn(player, coordinate) {
    var _a;
    if (((_a = document.getElementById(coordinate)) === null || _a === void 0 ? void 0 : _a.innerText) === "•")
        return false;
    var enemy = player.name === "player1" ? player2 : player1;
    var grid = player.name === "player1"
        ? parseInt(coordinate, 10) - 100
        : parseInt(coordinate, 10);
    markAttack(coordinate, enemy, grid);
    if (player === player2) {
        var moves = { index: 0, result: 0, ship: "" };
        moves.ship = enemy.board[grid];
        moves.result = checkHit(enemy, grid);
        moves.index = grid;
        previousMoves.push(moves);
    }
    else {
        checkHit(enemy, grid);
    }
    return true;
}
function convertEvent(e) {
    var target = e.target;
    var coordinates = parseInt(target.id, 10);
    return coordinates.toString();
}
function getProbability(board, shipLeft) {
    var _a, _b;
    var probability = [];
    var player3 = CreateGameBoard("player3");
    player3.board = __spreadArray([], board);
    for (var i = 0; i < board.length; i += 1) {
        var oddsHorizontal = 0;
        for (var x = 0; x < shipLeft.length; x += 1) {
            if (player3.placeFleet(getCoordinates(board[i], shipLeft[x].getHP()), "2"))
                oddsHorizontal += 1;
        }
        if (((_a = document.getElementById(i.toString())) === null || _a === void 0 ? void 0 : _a.innerText) === "•")
            oddsHorizontal = 0;
        probability.push(oddsHorizontal);
    }
    rotated = true;
    for (var i = 0; i < board.length; i += 1) {
        var oddsVertical = 0;
        for (var x = 0; x < shipLeft.length; x += 1) {
            if (player3.placeFleet(getCoordinates(board[i], shipLeft[x].getHP()), "2"))
                oddsVertical += 1;
        }
        if (((_b = document.getElementById(i.toString())) === null || _b === void 0 ? void 0 : _b.innerText) === "•")
            oddsVertical = 0;
        probability[i] += oddsVertical;
    }
    rotated = false;
    return probability;
}
function spreadHits(index, board) {
    var nearbySpaces = board.reduce(function (a, e, i) {
        return e === (index - 10).toString() ||
            e === (index + 10).toString() ||
            e === (index - 1).toString() ||
            e === (index + 1).toString()
            ? a.concat(i.toString())
            : a;
    }, []);
    var random = Math.floor(Math.random() * nearbySpaces.length);
    if (nearbySpaces.length === 0) {
        return null;
    }
    return nearbySpaces[random];
}
function focusHits(board, shipName) {
    var damagedShip = board.findIndex(function (arg) { return arg === shipName; });
    return damagedShip;
}
function getLastMove(index) {
    if (!previousMoves[previousMoves.length - index])
        return null;
    return previousMoves[previousMoves.length - index];
}
var hunt = false;
var shipsFound = [];
var shipsLeft = Object.keys(player1.fleet).map(function (arg) { return player1.fleet[arg]; });
function AIPlay() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var move;
    var freeSpots = player1.board.map(function (arg) {
        if (arg === "-2" || arg === "-3")
            arg = null;
        else
            arg = player1.board.indexOf(arg).toString();
        return arg;
    });
    if ((_b = player1.fleet[(_a = getLastMove(1)) === null || _a === void 0 ? void 0 : _a.ship]) === null || _b === void 0 ? void 0 : _b.isSunk()) {
        var indexLeft = shipsLeft
            .map(function (arg) { return arg.getName(); })
            .indexOf((_c = getLastMove(1)) === null || _c === void 0 ? void 0 : _c.ship);
        var indexFound = shipsFound.indexOf(getLastMove(1).ship);
        shipsLeft.splice(indexLeft, 1);
        shipsFound.splice(indexFound, 1);
        if (shipsFound.length === 0) {
            hunt = false;
            getLastMove(1).result = "-2";
        }
    }
    var highestSpots = Math.max.apply(Math, getProbability(freeSpots, shipsLeft));
    var highestProbability = getProbability(freeSpots, shipsLeft).reduce(function (a, e, i) { return (e === highestSpots ? a.concat(i) : a); }, []);
    var random = Math.floor(Math.random() * highestProbability.length);
    if (!hunt) {
        move = highestProbability[random];
    }
    if (((_d = getLastMove(1)) === null || _d === void 0 ? void 0 : _d.result) === "-3") {
        hunt = true;
        if (shipsFound.every(function (ship) { return ship !== getLastMove(1).ship; }))
            shipsFound.push(getLastMove(1).ship);
        move = spreadHits(getLastMove(1).index, freeSpots);
    }
    if (hunt && ((_e = getLastMove(1)) === null || _e === void 0 ? void 0 : _e.result) === "-2") {
        move = spreadHits(getLastMove(2).index, freeSpots);
    }
    if (hunt &&
        ((_f = getLastMove(1)) === null || _f === void 0 ? void 0 : _f.result) === "-2" &&
        ((_g = getLastMove(2)) === null || _g === void 0 ? void 0 : _g.result) === "-2") {
        move = spreadHits(getLastMove(3).index, freeSpots);
    }
    if (hunt &&
        ((_h = getLastMove(1)) === null || _h === void 0 ? void 0 : _h.result) === "-2" &&
        ((_j = getLastMove(2)) === null || _j === void 0 ? void 0 : _j.result) === "-2" &&
        ((_k = getLastMove(3)) === null || _k === void 0 ? void 0 : _k.result) === "-2") {
        move = spreadHits(getLastMove(4).index, freeSpots);
    }
    if (hunt &&
        ((_l = getLastMove(1)) === null || _l === void 0 ? void 0 : _l.result) === "-3" &&
        ((_m = getLastMove(2)) === null || _m === void 0 ? void 0 : _m.result) === "-2") {
        move = spreadHits(getLastMove(1).index, freeSpots);
    }
    if (hunt &&
        ((_o = getLastMove(1)) === null || _o === void 0 ? void 0 : _o.result) === "-2" &&
        ((_p = getLastMove(2)) === null || _p === void 0 ? void 0 : _p.result) === "-3" &&
        ((_q = getLastMove(3)) === null || _q === void 0 ? void 0 : _q.result) === "-3")
        move = focusHits(player1.board, getLastMove(2).ship);
    if (hunt &&
        ((_r = getLastMove(1)) === null || _r === void 0 ? void 0 : _r.result) === "-3" &&
        ((_s = getLastMove(2)) === null || _s === void 0 ? void 0 : _s.result) === "-3")
        move = focusHits(player1.board, getLastMove(1).ship);
    if (move === -1)
        move = spreadHits(getLastMove(2), freeSpots);
    if (shipsFound.length > 0 &&
        ((_t = getLastMove(1)) === null || _t === void 0 ? void 0 : _t.result) === "-2" &&
        ((_u = getLastMove(2)) === null || _u === void 0 ? void 0 : _u.result) === "-2" &&
        ((_v = getLastMove(3)) === null || _v === void 0 ? void 0 : _v.result) === "-2")
        move = focusHits(player1.board, shipsFound[0]);
    if (!move || move === -1)
        move = highestProbability[random];
    console.log(getProbability(freeSpots, shipsLeft));
    return move.toString();
}
function playGame(e) {
    if (takeTurn(player1, convertEvent(e)))
        takeTurn(player2, AIPlay());
}
function restart() {
    for (var i = 0; i < player1.board.length; i += 1) {
        player1.board[i] = i.toString();
        player2.board[i] = (i + 100).toString();
    }
    Object.values(player1.fleet).forEach(function (ship) { return ship.fullHeal(); });
    Object.values(player2.fleet).forEach(function (ship) { return ship.fullHeal(); });
    player1.fleetPlaced = [];
    player2.fleetPlaced = [];
    hunt = false;
    shipsFound = [];
    shipsLeft = Object.keys(player1.fleet).map(function (arg) { return player1.fleet[arg]; });
    document.querySelectorAll(".grid").forEach(function (grid) {
        grid.className = "grid";
        grid.style.color = "none";
        grid.innerText = "";
    });
    document.querySelectorAll(".warship").forEach(function (ship) {
        ship.style.display = "block";
    });
    document.querySelectorAll(".life").forEach(function (life) {
        life.style.color = "red";
    });
    if (document.getElementById("shipContainer").style.flexDirection === "row") {
        rotateShip();
    }
    changeUI("Place your ships");
    document.getElementById("content").style.display = "flex";
    document.getElementById("shipContainer").style.display = "flex";
    document.getElementById("player2Board").style.display = "none";
    document.getElementById("restart").style.display = "none";
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
    var restartButton = document.getElementById("restart");
    var validMove = true;
    warships.forEach(function (warship) {
        return warship.addEventListener("dragstart", dragstart);
    });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("dragover", function (e) { return e.preventDefault(); });
    playerBoard === null || playerBoard === void 0 ? void 0 : playerBoard.addEventListener("drop", function (e) {
        var _a;
        var target = e.target;
        var move = player1.placeFleet(getCoordinates(target.id, (_a = player1.fleet[shipID]) === null || _a === void 0 ? void 0 : _a.getHP()), shipID);
        if (!move) {
            validMove = false;
            return;
        }
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
    restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener("click", restart);
}
addListeners();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map