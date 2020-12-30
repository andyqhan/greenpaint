<template>
    <div v-if="currentSquaresFilled === squareCount">
        {{ gridFullCheck() }}
    </div>
    <div class="gridContainer" :style="cssGridVars">
        <div class="row" v-for="(row, row_index) in staticGrid" :key="row_index" :style="cssRowVars">
            <square v-for="(cell, cell_index) in row"
                    @square-focus="clickHandler($event)"
                    @rebus-enter="rebusEnter($event)"
                    @rebus-blur="rebusBlur($event)"
                    :key="[row_index, cell_index]"
                    :correctLetter="cell.correctLetter"
                    :isBlock="cell.isBlock"
                    :isCircled="cell.isCircled"
                    :isRebus="cell.isRebus"
                    :isWordStartAcross="cell.isWordStartAcross"
                    :isWordStartDown="cell.isWordStartDown"
                    :acrossNum="cell.acrossNum"
                    :downNum="cell.downNum"
                    :currentLetter="dynamicGrid[row_index][cell_index].currentLetter"
                    :currentDirection="currentDirection"
                    :x="cell.x"
                    :y="cell.y"
                    :isPoint="dynamicGrid[row_index][cell_index].isPoint"
                    :isPrimarySelect="dynamicGrid[row_index][cell_index].isPrimarySelect"
                    :isSecondarySelect="dynamicGrid[row_index][cell_index].isSecondarySelect"
                    :isCorrect="dynamicGrid[row_index][cell_index].isCorrect"
                    :isIncorrect="dynamicGrid[row_index][cell_index].isIncorrect"
                    :isRebusActive="dynamicGrid[row_index][cell_index].isRebusActive"
                    :settingsObject="settingsObject"
                    :isLeft="cell.isLeft"
                    :isRight="cell.isRight"
                    :isTop="cell.isTop"
                    :isBot="cell.isBot"
                    ></square>
        </div>
    </div>
</template>

<script>
 import square from './square.vue'
 
 export default {
     name: 'grid',
     components: {
         square
     },
     props: {
         gridObject: Array,
         cluesDown: Array,
         cluesAcross: Array,
         rebusObj: Object,
         settingsObject: Object
     },
     emits: [
         'square-focus-to-app',
         'squareFocusToApp',
         'gridFull',
         'grid-full'
     ],
     data() {
         return {
             currentDirection: "across",
             dynamicGrid: [],
             // these two are arrays of the indices of the previously selected words. the car
             // is the row or column; the cdr is the columns or rows
             previousSelectAcross: [],
             previousSelectDown: [],
             previousPoint: {},

             currentPoint: {y: 0, x: 0},
             currentSquaresFilled: 0,
         }
     },
     created() {
         // need to wait until methods load, which is why this is in created()
         this.dynamicGrid = this.createDynamicGrid();
     },
     computed: {
         cssGridVars() {
             return {
                 //'grid-template-columns': 'repeat(' + this.gridObject.length + ', 1fr)',
                 "height": "30em",
                 'grid-template-rows': 'repeat(' + this.gridObject[0].length + ', 1fr)',
                 'grid-auto-rows': `${100 / this.gridObject.length}%`,
             }
         },
         
         cssRowVars() {
             return {
                 'display': "grid",
                 'grid-template-columns': 'repeat(' + this.gridObject.length + ', 1fr)',
             }
         },

         createRebusObj() {
             let codeList = this.rebusObj.Codes.split(';');
             let codeObj = {};
             for (let codeIn = 0; codeIn < codeList.length; codeIn++) {
                 let thisCode = codeList[codeIn].split(':');
                 codeObj[thisCode[0]] = thisCode[1];
             }
             return codeObj;
         },
         
         staticGrid() {
             //console.log("staticGrid called")
             // gridObject is actually an array lol
             // for each cell in the grid, create on object with keys:
             // isBlock: it's a block / black square
             // isCircled: it's circled
             // isRebus: it's a rebus
             // isWordStartAcross: it's the start of an across word
             // isWordStartDown: it's the start of a down word
             // acrossNum: the clue number of this cell's across word
             // downNum: the clue number of this cell's down word
             let gridObject = this.gridObject
             var outputGrid = []
             var currentWordNum = 0
             for (let row in gridObject) {
                 let thisRowArray = gridObject[row]["Row"].split('')
                 outputGrid.push([])
                 for (let char in thisRowArray) {
                     var thisCell = {}
                     if (thisRowArray[char] === '.') {
                         thisCell['isBlock'] = thisRowArray[char] === '.'
                     } else {
                         // why the hell are char and row strings??
                         thisCell['x'] = Number(char)
                         thisCell['y'] = Number(row)

                         if (isNaN(thisRowArray[char])) {
                             // if it's not a number (that is, not a rebus)
                             thisCell['correctLetter'] = thisRowArray[char];
                         } else {
                             // else, it's a rebus. ask createRebusObj for the rebus corresponding to
                             // the (numerical) code in thisRowArray
                             thisCell['correctLetter'] = this.createRebusObj[thisRowArray[char].toString()];
                         }
                         thisCell['isCircled'] = thisRowArray[char] === thisRowArray[char].toLowerCase()
                         thisCell['isRebus'] = !isNaN(parseInt(thisRowArray[char]), 10)
                         thisCell['isBlock'] = false
                         
                         // char === 0 is when we're on the left edge of the grid
                         // the other condition is if the previous cell was a block
                         thisCell['isWordStartAcross'] = char == 0 || thisRowArray[char-1] === '.'

                         // row == 0 is when we're on the top edge of the grid
                         // TODO figure out why it wants == instead of ===
                         // the other condition is if the cell above was a block
                         thisCell['isWordStartDown'] = row == 0 || outputGrid[row-1][char]['isBlock']
                         
                         if (thisCell['isWordStartAcross'] || thisCell['isWordStartDown']) {
                             currentWordNum++
                         }
                         if (thisCell['isWordStartAcross']) {
                             // if this is the start of an across word, then currentWordNum is correct
                             thisCell['acrossNum'] = currentWordNum
                         } else {
                             // otherwise acrossNum is the same as the one before
                             thisCell['acrossNum'] = outputGrid[row][char-1]['acrossNum']
                         }
                         
                         if (thisCell['isWordStartDown']) {
                             // if this is the start of a down word, then currentWordNum is correct
                             thisCell['downNum'] = currentWordNum
                         } else {
                             // otherwise downNum is the same as the one above
                             thisCell['downNum'] = outputGrid[row-1][char]['downNum']
                         }

                         // get position of this cell for border css
                         if (char == 0) {
                             thisCell['isLeft'] = true;
                         } else if (char == thisRowArray.length-1) {
                             thisCell['isRight'] = true;
                         }
                         if (row == 0) {
                             thisCell['isTop'] = true;
                         } else if (row == gridObject.length-1) {
                             thisCell['isBot'] = true;
                         }
                     }
                     outputGrid[row].push(thisCell);
                 }
             }
             //console.log(outputGrid)
             return outputGrid
         },

         squareCount() {
             let count = 0;
             for (let iY = 0; iY < this.staticGrid.length; iY++) {
                 for (let iX = 0; iX < this.staticGrid[iY].length; iX++) {
                     if (this.staticGrid[iY][iX].isBlock === true) {
                         continue;
                     } else {
                         count += 1;
                     }
                 }
             }
             return count
         },

         firstSquareCoor() {
             // return the x-coord of the first non-block square on the first row
             // i'm hardcoding in that the 0th row is the first non-block row, but i
             // think this is a safe assumption
             let iX = 0;
             while (this.staticGrid[0][iX].isBlock === true) {
                 iX++;
             }
             return {y: 0, x: iX}
         }
     },
     methods: {
         createDynamicGrid() {
             //console.log('createDynamicGrid called')
             // i wonder if it's a problem that this is reading static data (rather than a param)
             var outputGrid = []
             for (let row in this.staticGrid) {
                 outputGrid.push([])
                 for (let char in this.staticGrid[row]) {
                     var thisCell = {}
                     thisCell['isBlock'] = this.staticGrid[row][char]['isBlock'] === true
                     if (thisCell['isBlock'] != true) {
                         thisCell['x'] = this.staticGrid[row][char]['x']
                         thisCell['y'] = this.staticGrid[row][char]['y']
                         
                         thisCell['isPrimarySelect'] = false;
                         thisCell['isSecondarySelect'] = false;
                         thisCell['isPoint'] = false;
                         
                         thisCell['currentLetter'] = '';
                         thisCell['isCorrect'] = false;
                         thisCell['isIncorrect'] = false;
                         thisCell['isRebusActive'] = false;
                     }
                     outputGrid[row].push(thisCell)
                 }
             }
             //console.log(outputGrid)
             return outputGrid
         },

         reCreateDynamicGrid() {
             this.dynamicGrid = this.createDynamicGrid();
             console.log(this.cluesAcross);
         },

         clearPrevious() {
             //console.log("clearPrevious called")
             // clear previous across
             for (let ai = 1; ai < this.previousSelectAcross.length; ai++) {
                 this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isPrimarySelect'] = false;
                 this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isSecondarySelect'] = false;
                 this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isRebusActive'] = false;
             }
             for (let di = 1; di < this.previousSelectDown.length; di++) {
                 this.dynamicGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isPrimarySelect'] = false;
                 this.dynamicGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isSecondarySelect'] = false;
                 this.dynamicGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isRebusActive'] = false;
             }
             // clear previous point
             this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectDown[0]]['isPoint'] = false;
             
             // reset
             this.previousSelectAcross = [];
             this.previousSelectDown = [];
         },

         activateRebus() {
             this.dynamicGrid[this.currentPoint.y][this.currentPoint.x].currentLetter = ''
             this.removeKeyEventListener();
             this.dynamicGrid[this.currentPoint.y][this.currentPoint.x].isRebusActive = !this.dynamicGrid[this.currentPoint.y][this.currentPoint.x].isRebusActive;
         },

         rebusEnter(event) {
             this.dynamicGrid[this.currentPoint.y][this.currentPoint.x].currentLetter = event.toUpperCase();
             this.dynamicGrid[this.currentPoint.y][this.currentPoint.x].isRebusActive = false;
             this.addKeyEventListener();
         },

         rebusBlur(event) {
             this.dynamicGrid[this.currentPoint.y][this.currentPoint.x].currentLetter = event.toUpperCase();
             this.addKeyEventListener();
         },
         
         focusEar(event) {
             // set previous point (multiple lines to prevent variable shadowing)
             this.previousPoint.x = this.currentPoint.x;
             this.previousPoint.y = this.currentPoint.y;
             if (this.previousSelectAcross.length != 0 && this.previousSelectDown.length != 0) {
                 // clear the previous selection's css if there was a previous selection
                 this.clearPrevious();
             }

             let eventX = event.x
             let eventY = event.y
             let primaryDirection = ""
             if (!event.direction) {
                 // the direction param is not passed if it's a mouse click
                 if (this.currentDirection === "across") {
                     primaryDirection = "across"
                     //var secondaryDirection = "down"
                 } else if (this.currentDirection === "down") {
                     primaryDirection = "down"
                     //var secondaryDirection = "across"
                 }
             } else {
                 // the direction param is passed if it's a keyboard movement
                 primaryDirection = event.direction
             }

             // initialize with the constant cars
             // TODO make previousSelect objects, so the code is more readable
             // and i'm not just refering to indices
             this.previousSelectAcross.push(eventY)  
             this.previousSelectDown.push(eventX)

             var whileX = eventX;
             // search backward for across
             while (this.dynamicGrid[eventY][whileX] && this.dynamicGrid[eventY][whileX]['isBlock'] != true) {
                 //console.log(whileX)
                 if (primaryDirection === "across") {
                     this.dynamicGrid[eventY][whileX]['isPrimarySelect'] = true
                 } else {
                     this.dynamicGrid[eventY][whileX]['isSecondarySelect'] = true
                 }
                 this.previousSelectAcross.push(whileX)
                 whileX--
             }
             // plus one so we don't search the same block twice
             whileX = eventX;
             // search forward for across
             while (this.dynamicGrid[eventY][whileX] && this.dynamicGrid[eventY][whileX]['isBlock'] != true) {
                 if (primaryDirection === "across") {
                     this.dynamicGrid[eventY][whileX]['isPrimarySelect'] = true
                 } else {
                     this.dynamicGrid[eventY][whileX]['isSecondarySelect'] = true
                 }
                 this.previousSelectAcross.push(whileX)
                 whileX++
             }
             
             var whileY = eventY;
             // search backwards for down
             while (this.dynamicGrid[whileY] && this.dynamicGrid[whileY][eventX]['isBlock'] != true) {
                 if (primaryDirection === "down") {
                     this.dynamicGrid[whileY][eventX]['isPrimarySelect'] = true
                 } else {
                     this.dynamicGrid[whileY][eventX]['isSecondarySelect'] = true
                 }
                 this.previousSelectDown.push(whileY)
                 whileY--
             }
             whileY = eventY;
             // search forward for down
             while (this.dynamicGrid[whileY] && this.dynamicGrid[whileY][eventX]['isBlock'] != true) {
                 if (primaryDirection === "down") {
                     this.dynamicGrid[whileY][eventX]['isPrimarySelect'] = true
                 } else {
                     this.dynamicGrid[whileY][eventX]['isSecondarySelect'] = true
                 }
                 this.previousSelectDown.push(whileY)
                 whileY++
             }
             
             // set point
             this.dynamicGrid[eventY][eventX]['isPoint'] = true;
             this.currentPoint.y = eventY;
             this.currentPoint.x = eventX;

             // pass up to app.vue
             this.$emit('square-focus-to-app', {
                 squareFocusEvent: event,
                 primaryDirection: primaryDirection,
                 currentPoint: this.currentPoint,
             })
         },

         focusFromClueClick(event) {
             // event is in the form of an object:
             // {num: (clue number), direction: (clue direction)}
             for (let iY = 0; iY < this.staticGrid.length; iY++) {
                 for (let iX = 0; iX < this.staticGrid[iY].length; iX++) {
                     if (this.staticGrid[iY][iX].isBlock === true) {
                         continue
                     } else {
                         if (event.direction === "A") {
                             if (this.staticGrid[iY][iX].isWordStartAcross === true && this.staticGrid[iY][iX].acrossNum === event.num) {
                                 this.focusEar({
                                     y: iY,
                                     x: iX,
                                     direction: "across",
                                     acrossNum: this.staticGrid[iY][iX]['acrossNum'],
                                     downNum: this.staticGrid[iY][iX]['downNum']
                                 })
                                 return
                             }
                         } else if (event.direction === "D") {
                             if (this.staticGrid[iY][iX].isWordStartDown === true && this.staticGrid[iY][iX].downNum === event.num) {
                                 this.focusEar({
                                     y: iY,
                                     x: iX,
                                     direction: "down",
                                     acrossNum: this.staticGrid[iY][iX]['acrossNum'],
                                     downNum: this.staticGrid[iY][iX]['downNum']
                                 })
                                 return
                             }
                         }
                     }
                 }
             }
         },

         movePointNaive(targetY, targetX) {
             // try to avoid calling this function
             this.focusEar({y: targetY, x: targetX});
         },

         movePointSmart(direction) {
             // direction is a string "up", "down", "left", "right"
             switch(direction.toLowerCase()) {
                 case "up":
                     if (this.currentDirection === "across") {
                         this.switchDirection();
                     }
                     if (this.currentPoint.y === 0) {
                         // do nothing at the top of the grid
                         break;
                     } else if (this.dynamicGrid[this.currentPoint.y-1][this.currentPoint.x]['isBlock'] === true) {
                         // look for the closest block that's not a block
                         let targetY = this.currentPoint.y-1;
                         while (targetY !== -1 && this.dynamicGrid[targetY][this.currentPoint.x]['isBlock'] === true) {
                             targetY--;
                         }
                         if (targetY !== -1) {
                             // if target is -1, there's no non-block above point
                             this.focusEar({
                                 y: targetY,
                                 x: this.currentPoint.x,
                                 direction: this.currentDirection,
                                 acrossNum: this.staticGrid[targetY][this.currentPoint.x]['acrossNum'],
                                 downNum: this.staticGrid[targetY][this.currentPoint.x]['downNum']
                             });
                         }
                     } else {
                         this.focusEar({
                             y: this.currentPoint.y-1,
                             x: this.currentPoint.x,
                             direction: this.currentDirection,
                             acrossNum: this.staticGrid[this.currentPoint.y-1][this.currentPoint.x]['acrossNum'],
                             downNum: this.staticGrid[this.currentPoint.y-1][this.currentPoint.x]['downNum']
                         });
                     }
                     break;
                 case "down":
                     if (this.currentDirection === "across") {
                         this.switchDirection();
                     }
                     if (this.currentPoint.y === this.dynamicGrid.length) {
                         // do nothing at the top of the grid
                         break;
                     } else if (this.dynamicGrid[this.currentPoint.y+1][this.currentPoint.x]['isBlock'] === true) {
                         // look for the closest block that's not a block
                         let targetY = this.currentPoint.y+1;
                         while (targetY <= this.dynamicGrid.length-1 && this.dynamicGrid[targetY][this.currentPoint.x]['isBlock'] === true) {
                             targetY++;
                         }
                         if (targetY <= this.dynamicGrid.length-1) {
                             this.focusEar({
                                 y: targetY,
                                 x: this.currentPoint.x,
                                 direction: this.currentDirection,
                                 acrossNum: this.staticGrid[targetY][this.currentPoint.x]['acrossNum'],
                                 downNum: this.staticGrid[targetY][this.currentPoint.x]['downNum']
                             });
                         }
                     } else {
                         this.focusEar({
                             y: this.currentPoint.y+1,
                             x: this.currentPoint.x,
                             direction: this.currentDirection,
                             acrossNum: this.staticGrid[this.currentPoint.y+1][this.currentPoint.x]['acrossNum'],
                             downNum: this.staticGrid[this.currentPoint.y+1][this.currentPoint.x]['downNum']
                         });
                     }
                     break;
                 case "left":
                     if (this.currentDirection === "down") {
                         this.switchDirection()
                     }
                     if (this.currentPoint.x === 0 && this.currentPoint.y === 0) {
                         // do nothing at top left corner
                         break;
                     } else if (this.currentPoint.x === 0 && this.currentPoint.y !== 0) {
                         // wrap around if we're at the left edge
                         let targetX = this.dynamicGrid[0].length-1;
                         while (this.dynamicGrid[this.currentPoint.y-1][targetX]['isBlock'] === true) {
                             targetX--;
                         }
                         this.focusEar({
                             y: this.currentPoint.y-1,
                             x: targetX,
                             direction: this.currentDirection,
                             acrossNum: this.staticGrid[this.currentPoint.y-1][targetX]['acrossNum'],
                             downNum: this.staticGrid[this.currentPoint.y-1][targetX]['downNum']
                         })
                     } else if (this.dynamicGrid[this.currentPoint.y][this.currentPoint.x-1]['isBlock'] === true) {
                         // look for the closest square that's not a block
                         let targetX = this.currentPoint.x-1;
                         while (targetX !== -1 && this.dynamicGrid[this.currentPoint.y][targetX]['isBlock'] === true) {
                             targetX--;
                         }
                         if (targetX === -1) {
                             // case when the left edge is a block
                             // TODO this is a dirty hack refactor this code to be more efficient
                             // can't simply use moveAcrossWord('left') because then it skips to the beginning of the word
                             let targetX2 = this.dynamicGrid[0].length-1;
                             while (this.dynamicGrid[this.currentPoint.y-1][targetX2]['isBlock'] === true) {
                                 targetX2--;
                             }
                             this.focusEar({
                                 y: this.currentPoint.y-1,
                                 x: targetX2,
                                 direction: this.currentDirection,
                                 acrossNum: this.staticGrid[this.currentPoint.y-1][targetX2]['acrossNum'],
                                 downNum: this.staticGrid[this.currentPoint.y-1][targetX2]['downNum']
                             })
                         } else if (targetX !== -1) {
                             this.focusEar({
                                 y: this.currentPoint.y,
                                 x: targetX,
                                 direction: this.currentDirection,
                                 acrossNum: this.staticGrid[this.currentPoint.y][targetX]['acrossNum'],
                                 downNum: this.staticGrid[this.currentPoint.y][targetX]['downNum'],
                             });
                         }
                     } else {
                         this.focusEar({
                             y: this.currentPoint.y,
                             x: this.currentPoint.x-1,
                             direction: this.currentDirection,
                             acrossNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x-1]['acrossNum'],
                             downNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x-1]['downNum'],
                         });
                     }
                     break;
                 case "right":
                     if (this.currentDirection === "down") {
                         this.switchDirection()
                     }
                     if (this.currentPoint.x === this.dynamicGrid[0].length-1 && this.currentPoint.y === this.dynamicGrid.length-1) {
                         // do nothing at the bottom right corner
                         break;
                     } else if (this.currentPoint.x === this.dynamicGrid[0].length-1 || this.staticGrid[this.currentPoint.y][this.currentPoint.x+1]['isBlock'] === true) {
                         this.moveAcrossWord("right");
                     } else {
                         this.focusEar({
                             y: this.currentPoint.y,
                             x: this.currentPoint.x+1,
                             direction: this.currentDirection,
                             acrossNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x+1]['acrossNum'],
                             downNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x+1]['downNum'],
                         });
                     }
                     break;
             }
         },

         switchDirection() {
             if (this.currentDirection === "across") {
                 this.currentDirection = "down"
             } else if (this.currentDirection === "down") {
                 this.currentDirection = "across"
             }
         },

         switchDirectionAndFocus() {
             this.switchDirection();
             this.focusEar({
                 y: this.currentPoint.y,
                 x: this.currentPoint.x,
                 direction: this.currentDirection,
                 acrossNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x]['acrossNum'],
                 downNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x]['downNum']
             })
         },

         clearSquareLetter(y, x) {
             this.dynamicGrid[y][x]['currentLetter'] = "";
         },

         moveForwardCurrentDirection() {
             // TODO gotta skip any squares that are already filled
             if (this.currentDirection === "across") {
                     this.movePointSmart("right");
                 } else if (this.currentDirection === "down") {
                     this.movePointSmart("down");
                 }
         },

         moveBackwardCurrentDirection() {
             if (this.currentDirection === "across") {
                 this.movePointSmart("left");
             } else if (this.currentDirection === "down") {
                 this.movePointSmart("up");
             }
         },

         // TODO maybe wrap around to the start of the grid
         // TODO also i think i've hardcoded in that the [0,0] square is not a block... oops
         getAcrossWordStart(y, x) {
             let currentAcrossNum = this.staticGrid[y][x]['acrossNum'];
             let targetX = x;
             while (targetX > 0 && this.staticGrid[y][targetX]['acrossNum'] === currentAcrossNum) {
                 // iterate till we get the start of across word
                 targetX--;
             }
             //console.log(targetX)
             if (this.staticGrid[y][targetX]['isBlock'] === true) {
                 return {y: y, x: targetX+1}
             } else {
                 return {y: y, x: targetX}
             }
         },
         
         getAcrossWordEnd(y, x) {
             let currentAcrossNum = this.staticGrid[y][x]['acrossNum'];
             let targetX = x;
             console.log("current across num: " + currentAcrossNum.toString())
             while (targetX < this.staticGrid[y].length && this.staticGrid[y][targetX]['acrossNum'] === currentAcrossNum) {
                 targetX++;
             }
             console.log("targetX: " + targetX.toString())
             if (targetX >= this.staticGrid[y].length || this.staticGrid[y][targetX]['isBlock'] === true) {
                 console.log('was a block')
                 return {y: y, x: targetX-1}
             } else {
                 console.log('was not a block')
                 return {y: y, x: targetX}
             }
         },

         getNextAcrossNum() {
             let currentAcrossNum = this.staticGrid[this.currentPoint.y][this.currentPoint.x]['acrossNum'];
             if (currentAcrossNum === this.cluesAcross[this.cluesAcross.length-1].Num) {
                 return null
             }
             // TODO binary search to make this faster?
             for (let clueIndex = 0; clueIndex < this.cluesAcross.length; clueIndex++) {
                 if (this.cluesAcross[clueIndex].Num === currentAcrossNum) {
                     return this.cluesAcross[clueIndex+1].Num;
                 }
             }
         },

         getNextAcrossWord() {
             let x = this.currentPoint.x;
             for (let y = this.currentPoint.y; y < this.staticGrid.length; y++) {
                 for (x; x < this.staticGrid[y].length; x++) {
                     if (this.staticGrid[y][x]['acrossNum'] === this.getNextAcrossNum()) {
                         return this.getAcrossWordStart(y, x);
                     }
                 }
                 x = 0;
             }

             // return the very first word if we can't find one above
             for (let iX = 0; iX < this.staticGrid[0].length; iX++) {
                 if (this.staticGrid[0][x]['acrossNum'] === 1) {
                     return this.getAcrossWordStart(0, iX)
                 }
             }
             return null
         },

         getPreviousAcrossNum() {
             let currentAcrossNum = this.staticGrid[this.currentPoint.y][this.currentPoint.x]['acrossNum'];
             if (currentAcrossNum === 1) {
                 return this.cluesAcross[this.cluesAcross.length-1]
             }
             for (let clueIndex = 0; clueIndex < this.cluesAcross.length; clueIndex++) {
                 if (this.cluesAcross[clueIndex].Num === currentAcrossNum) {
                     return this.cluesAcross[clueIndex-1].Num;
                 }
             }
         },

         getPreviousAcrossWord() {
             let x = this.currentPoint.x;
             for (let y = this.currentPoint.y; y >= 0; y--) {
                 for (x; x >= 0; x--) {
                     if (this.staticGrid[y][x]['acrossNum'] === this.getPreviousAcrossNum()) {
                         return this.getAcrossWordStart(y, x)
                     }
                 }
                 x = this.staticGrid[y].length-1;
             }

             // return the last word if we can't find one above
             let lastRow = this.staticGrid.length-1
             for (let iX = this.staticGrid[lastRow].length-1; iX >= 0; iX--) {
                 if (this.staticGrid[lastRow][iX].isBlock !== true) {
                     return this.getAcrossWordStart(lastRow, iX);
                 }
             }
             console.log("getPreviousAcrossWord: returning null");
             return null
         },

         moveAcrossWord(direction) {
             let nextWordStart;
             let nextEmpty;
             if (direction === "right") {
                 nextWordStart = this.getNextAcrossWord();
                 nextEmpty = this.getNextEmptyAcross(nextWordStart.y, nextWordStart.x);
             } else if (direction === "left") {
                 nextWordStart = this.getPreviousAcrossWord();
                 nextEmpty = this.getPreviousEmptyAcross(nextWordStart.y, nextWordStart.x);
                 nextEmpty = this.getAcrossWordStart(nextEmpty.y, nextEmpty.x);
                 // MAYB add logic to move to the next empty square? but how to handle if all of them are full
             }
             if (!nextWordStart) {
                 console.log("moveAcrossWord: no nextwordstart!")
                 return
             }
             //console.log(nextWordStart)
             this.focusEar({
                 y: nextEmpty.y,
                 x: nextEmpty.x,
                 direction: this.currentDirection,
                 acrossNum: this.staticGrid[nextEmpty.y][nextEmpty.x]['acrossNum'],
                 downNum: this.staticGrid[nextEmpty.y][nextEmpty.x]['downNum']
             })
         },

         getDownWordStart(y, x) {
             //console.log('computing getDownWordStart')
             let currentDownNum = this.staticGrid[y][x]['downNum'];
             let targetY = y;
             while (targetY > 0 && this.staticGrid[targetY][x]['downNum'] === currentDownNum) {
                 // iterate till we get the next down word
                 targetY--;
             }
             if (this.staticGrid[targetY][x]['isBlock'] === true) {
                 //console.log('getDownWordStart returning plus one since block ' + (targetY+1).toString() + ", " + x.toString())
                 return {y: targetY+1, x: x}
             } else {
                 //console.log('getDownWordStart returning ' + targetY.toString() + ", " + x.toString())
                 return {y: targetY, x: x}                 
             }
         },

         getDownWordEnd(y, x) {
             let currentDownNum = this.staticGrid[y][x]['downNum'];
             let targetY = y;
             while (targetY < this.staticGrid.length && this.staticGrid[targetY][x]['downNum'] === currentDownNum) {
                 // iterate till we get the next down word
                 targetY++;
             }
             if (targetY >= this.staticGrid.length || this.staticGrid[targetY][x]['isBlock'] === true) {
                 return {y: targetY-1, x: x}
             } else {
                 return {y: targetY, x: x}                 
             }
         },

         isDownWordEnd(y, x) {
             // utility function that returns a boolean saying if the square at y, x is an end
             // of a down word
             return (y === this.getDownWordEnd(y, x).y) && (x === this.getDownWordEnd(y, x).x);
         },

         getNextDownNum(y=this.currentPoint.y, x=this.currentPoint.y) {
             // returns the next down word's clue number
             let currentDownNum = this.staticGrid[y][x]['downNum'];
             if (currentDownNum === this.cluesDown[this.cluesDown.length-1].Num) {
                 // exit when we're at the last
                 return null
             }
             for (let clueIndex = 0; clueIndex < this.cluesDown.length; clueIndex++) {
                 if (this.cluesDown[clueIndex].Num === currentDownNum) {
                     //console.log("nextDownNum: " + this.cluesDown[clueIndex+1].Num.toString())
                     return this.cluesDown[clueIndex+1].Num;
                 }
             }
         },

         getNextDownWord(y=this.currentPoint.y, x=this.currentPoint.x) {
             // return coordinates of the next down word, wrapping around to the first
             let currentDownStart = this.getDownWordStart(y, x);
             let cx = currentDownStart.x;
             let cy = currentDownStart.y;
             for (cy; cy < this.staticGrid.length; cy++) {
                 for (cx; cx < this.staticGrid[cy].length; cx++) {
                     //console.log("iterating downNum: " + this.staticGrid[y][x]['downNum'].toString());
                     if (this.staticGrid[cy][cx]['downNum'] === this.getNextDownNum(y, x)) {
                         //console.log('returning getDownWordStart')
                         return this.getDownWordStart(cy, cx);
                     }
                 }
                 cx = 0;
             }
             // if we're at the last word, then return the first square's coordinates
             // i could probably do an early-exit by checking the current down num
             // with the last down num
             return this.firstSquareCoor
         },

         getPreviousDownNum() {
             let currentDownNum = this.staticGrid[this.currentPoint.y][this.currentPoint.x]['downNum'];
             if (currentDownNum === 1) {
                 // exit when we're at the first
                 return null
             }
             for (let clueIndex = 0; clueIndex < this.cluesDown.length; clueIndex++) {
                 if (this.cluesDown[clueIndex].Num === currentDownNum) {
                     return this.cluesDown[clueIndex-1].Num;
                 }
             }
         },

         getPreviousDownWord() {
             let x = this.currentPoint.x;
             for (let y = this.currentPoint.y; y >= 0; y--) {
                 for (x; x >= 0; x--) {
                     if (this.staticGrid[y][x]['downNum'] === this.getPreviousDownNum()) {
                         return this.getDownWordStart(y, x)
                     }
                 }
                 x = this.staticGrid[y].length-1;
             }
             return null
         },

         moveDownWord(direction) {
             let targetWordStart;
             if (direction === "right") {
                 targetWordStart = this.getNextDownWord();
             } else if (direction === "left") {
                 targetWordStart = this.getPreviousDownWord();
             }
             if (!targetWordStart) {
                 console.log("moveDownWord: no target word");
                 return;
             }
             this.focusEar({
                 y: targetWordStart.y,
                 x: targetWordStart.x,
                 direction: this.currentDirection,
                 acrossNum: this.staticGrid[targetWordStart.y][targetWordStart.x]['acrossNum'],
                 downNum: this.staticGrid[targetWordStart.y][targetWordStart.x]['downNum']
             })
         },

         getNextEmptyAcross(y=this.currentPoint.y, x=this.currentPoint.x) {
             let iX = x;
             for (let iY = y; iY < this.staticGrid.length; iY++) {
                 for (iX; iX < this.staticGrid[iY].length; iX++) {
                     if (this.dynamicGrid[iY][iX].isBlock !== true && this.dynamicGrid[iY][iX].currentLetter === "") {
                         return {y: iY, x: iX}
                     }
                 }
                 iX = 0;
             }
             // if there's no empty square starting from point, look for it before point
             // the reason we're not doing a recursive call is because i'm afraid of infinite loop
             for (let iY = 0; iY < this.staticGrid.length; iY++) {
                 for (let iX = 0; iX < this.staticGrid[iY].length; iX++) {
                     if (this.dynamicGrid[iY][iX].isBlock !== true && this.dynamicGrid[iY][iX].currentLetter === "") {
                         return {y: iY, x: iX}
                     }
                 }
             }
             // if we can't find one still
             console.log("getNextEmptyAcross: can't find empty square");
             return null
         },

         getPreviousEmptyAcross(y=this.currentPoint.y, x=this.currentPoint.x) {
             let iX = x;
             for (let iY = y; iY >= 0; iY--) {
                 for (iX; iX >= 0; iX--) {
                     console.log(`iY: ${iY}; iX: ${iX}`)
                     if (this.dynamicGrid[iY][iX].isBlock !== true && this.dynamicGrid[iY][iX].currentLetter === "") {
                         return {y: iY, x: iX}
                     }
                 }
                 iX = this.staticGrid[iY].length-1;
             }
             
             // if we can't find it, wrap around to the end of the grid
             let lastRow = this.staticGrid.length-1
             for (let iY = lastRow; iY >= 0; iY--) {
                 for (iX = this.staticGrid[lastRow].length-1; iX >= 0; iX--) {
                     if (this.dynamicGrid[iY][iX].isBlock !== true && this.dynamicGrid[iY][iX].currentLetter === "") {
                         return {y: iY, x: iX}
                     }
                 }
             }
             console.log("getPreviousEmptyAcross: can't find previous empty square");
             return null
         },

         getNextEmptyDown() {
             let iX = this.currentPoint.x;
             let iY = this.currentPoint.y;
             //let alreadySearchedFull = false;
             if (this.currentSquaresFilled === this.squareCount) {
                 console.log("getNextEmptyDown: grid full!")
                 return;
             }
             while (this.dynamicGrid[iY][iX].isBlock === true || this.dynamicGrid[iY][iX].currentLetter !== "") {
                 if (this.isDownWordEnd(iY, iX)) {
                     // if this is the end of the word, start over from the beginning of the next word
                     let nextDown = this.getNextDownWord(iY, iX);
                     if (nextDown) {
                         iX = nextDown.x;
                         iY = nextDown.y;
                     }
                 } else if (!this.isDownWordEnd(iY, iX)) {
                     iY += 1;
                 }
             }
             return {y: iY, x: iX}
         },

         moveNextEmpty() {
             let nextEmpty;
             if (this.currentDirection === "across") {
                 nextEmpty = this.getNextEmptyAcross();
             } else if (this.currentDirection === "down") {
                 nextEmpty = this.getNextEmptyDown();
                 console.log(nextEmpty);
             }
             this.focusEar({
                 y: nextEmpty.y,
                 x: nextEmpty.x,
                 direction: this.currentDirection,
                 acrossNum: this.staticGrid[nextEmpty.y][nextEmpty.x]['acrossNum'],
                 downNum: this.staticGrid[nextEmpty.y][nextEmpty.x]['downNum']
             });
         },

         moveStartWord(direction) {
             // move to the start of this word
             // direction is either "across" or "down"
             let target;
             if (direction === "across") {
                 target = this.getAcrossWordStart(this.currentPoint.y, this.currentPoint.x);
             } else if (direction === "down") {
                 target = this.getDownWordStart(this.currentPoint.y, this.currentPoint.x);
             }

             if (target.x === this.currentPoint.x && target.y === this.currentPoint.y) {
                 // we're already at the end of the word; simulate backtab behavior
                 if (this.currentDirection === "across") {
                     this.moveAcrossWord("left");
                     return
                 } else if (this.currentDirection === "down") {
                     this.moveDownWord("left");
                     return
                 }
             }
             
             this.focusEar({
                 y: target.y,
                 x: target.x,
                 direction: this.currentDirection,
                 acrossNum: this.staticGrid[target.y][target.x]['acrossNum'],
                 downNum: this.staticGrid[target.y][target.x]['downNum']
             });
         },

         moveEndWord(direction) {
             // move to the end of this word
             // direction is either "across" or "down"
             let target;
             if (direction === "across") {
                 target = this.getAcrossWordEnd(this.currentPoint.y, this.currentPoint.x);
             } else if (direction === "down") {
                 target = this.getDownWordEnd(this.currentPoint.y, this.currentPoint.x);
             }
             
             if (target.x === this.currentPoint.x && target.y === this.currentPoint.y) {
                 // we're already at the end of the word; simulate tab behavior
                 if (this.currentDirection === "across") {
                     this.moveAcrossWord("right");
                     return
                 } else if (this.currentDirection === "down") {
                     this.moveDownWord("right");
                     return
                 }
             }
             
             this.focusEar({
                 y: target.y,
                 x: target.x,
                 direction: this.currentDirection,
                 acrossNum: this.staticGrid[target.y][target.x]['acrossNum'],
                 downNum: this.staticGrid[target.y][target.x]['downNum']
             })
         },

         clearCheckSquare(y, x) {
             this.dynamicGrid[y][x]['isIncorrect'] = false;
             this.dynamicGrid[y][x]['isCorrect'] = false;
         },
         
         checkSquare(y=this.currentPoint.y, x=this.currentPoint.x) {
             if (this.dynamicGrid[y][x]['currentLetter'] === this.staticGrid[y][x]['correctLetter']) {
                 this.dynamicGrid[y][x]['isIncorrect'] = false;
                 this.dynamicGrid[y][x]['isCorrect'] = true;
             } else {
                 this.dynamicGrid[y][x]['isIncorrect'] = true;
                 this.dynamicGrid[y][x]['isCorrect'] = false;
             }
         },

         checkWord(y=this.currentPoint.y, x=this.currentPoint.x) {
             let wordStart;
             let wordEnd;
             if (this.currentDirection === "across") {
                 wordStart = this.getAcrossWordStart(y, x).x;
                 wordEnd = this.getAcrossWordEnd(y, x).x;
                 //console.log("across start: " + wordStart.toString());
                 //console.log("across end: " + wordEnd.toString())
                 for (let iX = wordStart; iX <= wordEnd; iX++) {
                     this.checkSquare(y, iX);
                 }
             } else if (this.currentDirection === "down") {
                 wordStart = this.getDownWordStart(y, x).y;
                 wordEnd = this.getDownWordEnd(y, x).y;
                 for (let iY = wordStart; iY <= wordEnd; iY++) {
                     this.checkSquare(iY, x);
                 }
             }
         },

         checkGrid() {
             for (let iY = 0; iY < this.staticGrid.length; iY++) {
                 for (let iX = 0; iX < this.staticGrid[iY].length; iX++) {
                     if (this.staticGrid[iY][iX].isBlock === true) {
                         continue;
                     } else {
                         this.checkSquare(iY, iX);
                     }
                 }
             }
         },

         revealSquare(y=this.currentPoint.y, x=this.currentPoint.x) {
             this.dynamicGrid[y][x]['currentLetter'] = this.staticGrid[y][x]['correctLetter'];
             this.dynamicGrid[y][x]['isIncorrect'] = false;
             this.dynamicGrid[y][x]['isCorrect'] = true;
         },

         revealWord(y=this.currentPoint.y, x=this.currentPoint.x) {
             let wordStart;
             let wordEnd;
             if (this.currentDirection === "across") {
                 wordStart = this.getAcrossWordStart(y, x).x;
                 wordEnd = this.getAcrossWordEnd(y, x).x;
                 for (let iX = wordStart; iX <= wordEnd; iX++) {
                     this.revealSquare(y, iX);
                 }
             } else if (this.currentDirection === "down") {
                 wordStart = this.getDownWordStart(y, x).y;
                 wordEnd = this.getDownWordEnd(y, x).y;
                 for (let iY = wordStart; iY <= wordEnd; iY++) {
                     this.revealSquare(iY, x);
                 }
             }
         },

         revealGrid() {
             for (let iY = 0; iY < this.staticGrid.length; iY++) {
                 for (let iX = 0; iX < this.staticGrid[iY].length; iX++) {
                     if (this.staticGrid[iY][iX].isBlock === true) {
                         continue;
                     } else {
                         this.revealSquare(iY, iX);
                     }
                 }
             }
         },

         clearWordLetters(y=this.currentPoint.y, x=this.currentPoint.x) {
             let wordEnd;
             if (this.currentDirection === "across") {
                 wordEnd = this.getAcrossWordEnd(y, x).x;
                 for (let iX = x; iX <= wordEnd; iX++) {
                     this.clearSquareLetter(y, iX);
                 }
             } else if (this.currentDirection === "down") {
                 wordEnd = this.getDownWordEnd(y, x).y;
                 for (let iY = y; iY <= wordEnd; iY++) {
                     this.clearSquareLetter(iY, x);
                 }
             }
         },

         clearGrid() {
             for (let iY = 0; iY < this.staticGrid.length; iY++) {
                 for (let iX = 0; iX < this.staticGrid[iY].length; iX++) {
                     this.clearCheckSquare(iY, iX);
                     this.clearSquareLetter(iY, iX);
                 }
             }
         },

         clickHandler(event) {
             if (event.x === this.currentPoint.x && event.y === this.currentPoint.y) {
                 // if user clicks on the the point
                 if (this.dynamicGrid[event.y][event.x].isRebusActive) {
                     // if it's a rebus, do nothing
                     return;
                 } else {
                     // else, switch direction
                     this.switchDirectionAndFocus()
                 }
             } else {
                 this.focusEar(event)
             }
         },

         keyHandler(event) {
             // TODO possibly don't prevent default if the event is meta
             // to preserve cmd-r and cmd-f
             event.preventDefault()
             if (this.settingsObject.bindFunctionObject.moveRightSquare(event)) {
                 // console.log("moveRightSquare")
                 if (this.currentDirection === "down") {
                     this.switchDirectionAndFocus();
                 } else {
                     this.movePointSmart("right");
                 }
             } else if (this.settingsObject.bindFunctionObject.moveLeftSquare(event)) {
                 // console.log("moveLeftSquare")
                 if (this.currentDirection === "down") {
                     this.switchDirectionAndFocus();
                 } else {
                     this.movePointSmart("left");
                 }
             } else if (this.settingsObject.bindFunctionObject.moveUpSquare(event)) {
                 // console.log("moveUpSquare")
                 if (this.currentDirection === "across") {
                     this.switchDirectionAndFocus();
                 } else {
                     this.movePointSmart("up");
                 }
             } else if (this.settingsObject.bindFunctionObject.moveDownSquare(event)) {
                 // console.log("moveDownSquare")
                 if (this.currentDirection === "across") {
                     this.switchDirectionAndFocus();
                 } else {
                     this.movePointSmart("down");
                 }
             } else if (this.settingsObject.bindFunctionObject.deleteSquare(event)) {
                 // console.log("deleteSquare")
                 if (this.dynamicGrid[this.currentPoint.y][this.currentPoint.x]['isCorrect']) {
                     // don't delete the letter if we know it's correct
                 } else {
                     this.currentSquaresFilled -= 1;
                     this.clearSquareLetter(this.currentPoint.y, this.currentPoint.x);
                     this.clearCheckSquare(this.currentPoint.y, this.currentPoint.x);
                 }
                 this.moveBackwardCurrentDirection();
             } else if (this.settingsObject.bindFunctionObject.moveRightWord(event)) {
                 // console.log("moveRightWord")
                 if (this.currentDirection === "across") {
                     this.moveAcrossWord("right");
                 } else if (this.currentDirection === "down") {
                     this.moveDownWord("right");
                 }
             } else if (this.settingsObject.bindFunctionObject.moveLeftWord(event)) {
                 // console.log("moveLeftWord")
                 if (this.currentDirection === "across") {
                     this.moveAcrossWord("left");
                 } else if (this.currentDirection === "down") {
                     this.moveDownWord("left");
                 }
             } else if (this.settingsObject.bindFunctionObject.moveStartWord(event)) {
                 // console.log("moveStartWord")
                 this.moveStartWord(this.currentDirection);
             } else if (this.settingsObject.bindFunctionObject.moveEndWord(event)) {
                 // console.log("moveEndWord")
                 this.moveEndWord(this.currentDirection);
             } else if (this.settingsObject.bindFunctionObject.deleteWord(event)) {
                 // console.log("deleteWord")
                 this.clearWordLetters(this.currentPoint.y, this.currentPoint.x);
             } else if (this.settingsObject.bindFunctionObject.switchDirection(event)) {
                 // console.log("switchDirection")
                 this.switchDirectionAndFocus()
             } else if (/^\w/.test(event.key) && event.key.length === 1) {
                 // it's a letter to insert into grid
                 // console.log("inserting letter")
                 this.clearCheckSquare(this.currentPoint.y, this.currentPoint.x);
                 if (!this.dynamicGrid[this.currentPoint.y][this.currentPoint.x].isRebusActive) {
                     if (this.dynamicGrid[this.currentPoint.y][this.currentPoint.x]['currentLetter'] === "") {
                         this.currentSquaresFilled += 1;
                     }
                     this.dynamicGrid[this.currentPoint.y][this.currentPoint.x]['currentLetter'] = event.key.toUpperCase();
                     this.moveNextEmpty();
                 }
             }
         },

         gridFullCheck() {
             for (let iY = 0; iY < this.staticGrid.length; iY++) {
                 for (let iX = 0; iX < this.staticGrid[iY].length; iX++) {
                     if (this.dynamicGrid[iY][iX]['currentLetter'] !== this.staticGrid[iY][iX]['correctLetter']) {
                         this.$emit('grid-full', "incorrect"); 
                         return;
                     }
                 }
             }
             this.$emit('grid-full', "correct");
             return 
         },

         addKeyEventListener() {
             //console.log("added keyEventListener")
             window.addEventListener('keydown', this.keyHandler);
         },

         removeKeyEventListener() {
             //console.log('removed keyEventListener')
             window.removeEventListener('keydown', this.keyHandler);
         },
     },
     mounted() {
         // console.log(this.staticGrid)
         window.addEventListener('keydown', this.keyHandler);

         this.focusEar({
             y: 0,
             x: 0,
             direction: this.currentDirection,
             acrossNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x]['acrossNum'],
             downNum: this.staticGrid[this.currentPoint.y][this.currentPoint.x]['downNum'],
         })
     }
 }
</script>

<style scoped>
 .gridContainer {
     display: grid;
 }
</style>
