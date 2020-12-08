<template>
    <div class="gridContainer" :style="cssGridVars">
        <div class="row" v-for="(row, row_index) in staticGrid" :key="row_index" :style="cssRowVars">
            <square v-for="(cell, cell_index) in row"
                    :style="{ 'grid-column': cell_index+1 }"
                    @square-focus="focusEar($event)"
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
                    :isSecondarySelect="dynamicGrid[row_index][cell_index].isSecondarySelect"></square>
            <!-- ref="[row_index, cell_index]" :id="[row_index, cell_index]" -->
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
     props: ['gridObject'],
     emits: ['square-focus-to-app'],
     data() {
         return {
             currentDirection: "across",
             dynamicGrid: [],
             // these two are arrays of the indices of the previously selected words. the car
             // is the row or column; the cdr is the columns or rows
             previousSelectAcross: [],
             previousSelectDown: [],

             currentPoint: {y: 0, x: 0},
         }
     },
     created() {
         // need to wait until methods load, which is why this is in created()
         this.dynamicGrid = this.createDynamicGrid();
         //console.log(this.dynamicGridData)
     },
     computed: {
         cssGridVars() {
             return {
                 'grid-template-columns': 'repeat(' + this.gridObject.length + ', 1fr)',
                 'grid-template-rows': 'repeat(' + this.gridObject[0].length + ', 1fr)'
             }
         },
         cssRowVars() {
             return {
                 'grid-column-start': 1,
                 'grid-column-end': this.dynamicGrid[0].length
             }
         },
         staticGrid() {
             console.log("staticGrid called")
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
                         
                         thisCell['correctLetter'] = thisRowArray[char]
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
                     }
                     outputGrid[row].push(thisCell)
                 }
             }
             //console.log(outputGrid)
             return outputGrid
         },
     },
     methods: {
         createDynamicGrid() {
             console.log('createDynamicGrid called')
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
                     }
                     outputGrid[row].push(thisCell)
                 }
             }
             //console.log(outputGrid)
             return outputGrid
         },
         /// yeah i tried to organize my props and it broke stuff lol
         // getStaticProps(cell) {
         //     return {
         //         correctLetter: cell.correctLetter,
         //         isBlock: cell.isBlock,
         //         isCircled: cell.isCircled,
         //         isRebus: cell.isRebus,
         //         isWordStartAcross: cell.isWordStartAcross,
         //         isWordStartDown: cell.isWordStartDown,
         //         acrossNum: cell.acrossNum,
         //         downNum: cell.downNum,
         //         x: cell.x,
         //         y: cell.y,
         //     }
         // },

         clearPrevious() {
             console.log("clearPrevious called")
             // clear previous across
             for (let ai = 1; ai < this.previousSelectAcross.length; ai++) {
                 this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isPrimarySelect'] = false;
                 this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isSecondarySelect'] = false;
             }
             for (let di = 1; di < this.previousSelectDown.length; di++) {
                 this.dynamicGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isPrimarySelect'] = false;
                 this.dynamicGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isSecondarySelect'] = false;
             }
             // clear previous point
             this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectDown[0]]['isPoint'] = false;
             
             // reset
             this.previousSelectAcross = [];
             this.previousSelectDown = [];
         },
         
         focusEar(event) {
             if (this.previousSelectAcross.length != 0 && this.previousSelectDown.length != 0) {
                 this.clearPrevious();
             }
             console.log('focusEar called')
             //console.log(event)
             //let eventAcrossNum = event.acrossNum
             //let eventDownNum = event.downNum
             //let eventDirection = event.direction
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
             })
         },

         movePointNaive(targetY, targetX) {
             // try to avoid calling this function
             this.focusEar({y: targetY, x: targetX});
         },

         movePointSmart(direction) {
             // direction is a string "up", "down", "left", "right"
             // TODO maybe rename direction to movementDirection lol
             // passingDirection is the direction to pass to focusEar
             // TODO add functionality for wrapping around the edge of the grid
             // console.log(direction);
             // console.log(this.currentDirection);
             switch(direction.toLowerCase()) {
                 case "up":
                     // TODO consider implementing normal behavior (when you
                     // reach a block and currentDirection is down, move to the
                     // numerically next down clue). right now, it moves to the one
                     // immediately below, which is not how NYT or PuzzleMe does it
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
                     } else if (this.currentPoint.x === this.dynamicGrid[0].length-1 && this.currentPoint.y !== this.dynamicGrid.length-1) {
                         // wrap around if we're at the right edge
                         let targetX = 0;
                         while (this.dynamicGrid[this.currentPoint.y+1][targetX]['isBlock'] === true) {
                             targetX++;
                         }
                         this.focusEar({
                             y: this.currentPoint.y+1,
                             x: targetX,
                             direction: this.currentDirection,
                             acrossNum: this.staticGrid[this.currentPoint.y+1][targetX]['acrossNum'],
                             downNum: this.staticGrid[this.currentPoint.y+1][targetX]['downNum']
                         })
                     } else if (this.dynamicGrid[this.currentPoint.y][this.currentPoint.x+1]['isBlock'] === true) {
                         // look for the closest square that's not a block
                         let targetX = this.currentPoint.x+1;
                         while (targetX <= this.dynamicGrid[0].length-1 && this.dynamicGrid[this.currentPoint.y][targetX]['isBlock'] === true) {
                             targetX++;
                         }
                         if (targetX > this.dynamicGrid[0].length-1) {
                             // case when the right edge is a block
                             // TODO this is a dirty hack refactor this code to be more efficient
                             let targetX2 = 0;
                             while (this.dynamicGrid[this.currentPoint.y+1][targetX2]['isBlock'] === true) {
                                 targetX2++;
                             }
                             this.focusEar({
                                 y: this.currentPoint.y+1,
                                 x: targetX2,
                                 direction: this.currentDirection,
                                 acrossNum: this.staticGrid[this.currentPoint.y+1][targetX2]['acrossNum'],
                                 downNum: this.staticGrid[this.currentPoint.y+1][targetX2]['downNum']
                             })
                         } else if (targetX <= this.dynamicGrid[0].length-1) {
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
         
         keyHandler(event) {
             //console.log(this.previousSelectAcross)
             // let prevY = this.previousSelectAcross[0];
             // let prevX = this.previousSelectDown[0];
             // TODO fix cluenum CSS geting fucked up with a letter
             if (/^\w/.test(event.key) && event.key.length === 1) {
                 // it's a letter to insert into grid
                 this.dynamicGrid[this.currentPoint.y][this.currentPoint.x]['currentLetter'] = event.key.toUpperCase();
                 this.moveForwardCurrentDirection();
             } else if (/^Backspace/.test(event.key)) {
                 // clear current letter and move back
                 this.clearSquareLetter(this.currentPoint.y, this.currentPoint.x);
                 this.moveBackwardCurrentDirection();
             } else if (/^Arrow/.test(event.key)) {
                 // move point
                 this.movePointSmart(event.key.slice(5))
             } else if (/^Space/.test(event.code)) {
                 // it's a space
                 this.switchDirectionAndFocus();
             }
         }
     },
     mounted() {
         //this.createGrid(this.gridObject)
         //console.log(this.dynamicGrid)
         //console.log(this.staticGrid)
         window.addEventListener('keyup', event => {
             // i don't get why these are being logged twice?
             console.log('keyup');
             console.log(event);
             this.keyHandler(event);
         });
     }
 }
</script>

<style scoped>
 .gridContainer {
     display: grid;
 }
</style>
