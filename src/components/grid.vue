<template>
    <div class="gridContainer">
        <div class="row" v-for="(row, row_index) in staticGrid" :key="row_index">
            <square v-for="(cell, cell_index) in row"
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
                    :x="cell.x"
                    :y="cell.y"
                    :direction="direction"                    
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
     data() {
         return {
             //staticGrid: this.createStaticGrid(this.gridObject),
             direction: "across",
             dynamicGrid: [],
             // these two are arrays of the indices of the previously selected words. the car
             // is the row or column; the cdr is the columns or rows
             previousSelectAcross: [],
             previousSelectDown: [],
         }
     },
     created() {
         // need to wait until methods load, which is why this is in created()
         this.dynamicGrid = this.createDynamicGrid()
         //console.log(this.dynamicGridData)
     },
     computed: {
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
                         
                         thisCell['isPrimarySelect'] = false
                         thisCell['isSecondarySelect'] = false
                         
                         thisCell['currentLetter'] = ''
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
             // clear previous across
             for (let ai = 1; ai < this.previousSelectAcross.length; ai++) {
                 this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isPrimarySelect'] = false
                 this.dynamicGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isSecondarySelect'] = false
             }
             for (let di = 1; di < this.previousSelectDown.length; di++) {
                 this.dynamicGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isPrimarySelect'] = false
                 this.dynamicGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isSecondarySelect'] = false
             }
             // reset
             this.previousSelectAcross = []
             this.previousSelectDown = []
         },
         
         focusEar(event) {
             this.clearPrevious()
             console.log('focusEar called')
             //console.log(event)
             //let eventAcrossNum = event.acrossNum
             //let eventDownNum = event.downNum
             //let eventDirection = event.direction
             let eventX = event.x
             let eventY = event.y
             let primaryDirection = ""
             if (event.direction === "across") {
                 primaryDirection = "across"
                 //var secondaryDirection = "down"
             } else if (event.direction === "down") {
                 primaryDirection = "down"
                 //var secondaryDirection = "across"
             }

             // initialize with the constant cars
             this.previousSelectAcross.push(eventY)
             this.previousSelectDown.push(eventX)

             var whileX = eventX - 1
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
             whileX = eventX + 1
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
             
             var whileY = eventY - 1
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
             whileY = eventY + 1
             // search forward for across
             while (this.dynamicGrid[whileY] && this.dynamicGrid[whileY][eventX]['isBlock'] != true) {
                 if (primaryDirection === "down") {
                     this.dynamicGrid[whileY][eventX]['isPrimarySelect'] = true
                 } else {
                     this.dynamicGrid[whileY][eventX]['isSecondarySelect'] = true
                 }
                 this.previousSelectDown.push(whileY)
                 whileY++
             }
         }
     },
     mounted() {
         //this.createGrid(this.gridObject)
         //console.log(this.dynamicGrid)
     }
 }
</script>
