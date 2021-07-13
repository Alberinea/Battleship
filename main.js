/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.ts":
/*!********************!*\
  !*** ./src/dom.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var warships = document.querySelectorAll('.warship');
var playerBoard = document.querySelector('.mainBoard');
function drop() {
    warships.forEach(function (warship) {
        return warship.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text', e.target.className);
        });
    });
    warships.forEach(function (warship) {
        return warship.addEventListener('dragend', function (e) {
            e.target.style.display = 'none';
        });
    });
    playerBoard.addEventListener('drop', function (e) {
        var data = e.dataTransfer.getData('text');
        e.target.className += " " + data;
    });
    playerBoard.addEventListener('dragover', function (e) { return e.preventDefault(); });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (drop);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.ts");

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
// const player2 = CreateGameBoard('player2');
console.log(player1);
document
    .querySelectorAll('.grid')
    .forEach(function (grid) { return grid.addEventListener('click', function (e) { return getCoordinates(e, 5); }); });
(0,_dom__WEBPACK_IMPORTED_MODULE_0__.default)();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map