<template>
    <div class="gridContainer">
        <div class="row" v-for="(row, row_index) in createdGrid" :key="row_index">
            <square v-for="(cell, cell_index) in row"
                    @square-focus="focusEar($event)"
                    :key="[row_index, cell_index]"
                    :id="[row_index, cell_index]"
                    ref="[row_index, cell_index]"
                    :correctLetter="cell.correctLetter"
                    :isBlock="cell.isBlock"
                    :isCircled="cell.isCircled"
                    :isRebus="cell.isRebus"
                    :isWordStartAcross="cell.isWordStartAcross"
                    :isWordStartDown="cell.isWordStartDown"
                    :acrossNum="cell.acrossNum"
                    :downNum="cell.downNum"
                    :direction="direction"
                    :x="cell.x"
                    :y="cell.y"
                    :isPrimarySelect="cell.isPrimarySelect"
                    :isSecondarySelect="cell.isSecondarySelect"></square>
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
             createdGrid: this.createGrid(this.gridObject),
             direction: "across",
             // these two are arrays of the indices of the previously selected words. the car
             // is the row or column; the cdr is the columns or rows
             previousSelectAcross: [],
             previousSelectDown: [],
         }
     },
     methods: {
         
         createGrid(gridObject) {
             // gridObject is actually an array lol
             // for each cell in the grid, create on object with keys:
             // isBlock: it's a block / black square
             // isCircled: it's circled
             // isRebus: it's a rebus
             // isWordStartAcross: it's the start of an across word
             // isWordStartDown: it's the start of a down word
             // acrossNum: the clue number of this cell's across word
             // downNum: the clue number of this cell's down word

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

                         thisCell['isPrimarySelect'] = false
                         thisCell['isSecondarySelect'] = false
                     }
                     outputGrid[row].push(thisCell)
                 }
             }
             console.log(outputGrid)
             return outputGrid
         },

         clearPrevious() {
             // clear previous across
             for (let ai = 1; ai < this.previousSelectAcross.length; ai++) {
                 this.createdGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isPrimarySelect'] = false
                 this.createdGrid[this.previousSelectAcross[0]][this.previousSelectAcross[ai]]['isSecondarySelect'] = false
             }
             for (let di = 1; di < this.previousSelectDown.length; di++) {
                 this.createdGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isPrimarySelect'] = false
                 this.createdGrid[this.previousSelectDown[di]][this.previousSelectDown[0]]['isSecondarySelect'] = false
             }
             // reset
             this.previousSelectAcross = []
             this.previousSelectDown = []
         },
         
         focusEar(event) {
             this.clearPrevious()
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
             while (this.createdGrid[eventY][whileX] && this.createdGrid[eventY][whileX]['isBlock'] != true) {
                 //console.log(whileX)
                 if (primaryDirection === "across") {
                     this.createdGrid[eventY][whileX]['isPrimarySelect'] = true
                 } else {
                     this.createdGrid[eventY][whileX]['isSecondarySelect'] = true
                 }
                 this.previousSelectAcross.push(whileX)
                 whileX--
             }
             // plus one so we don't search the same block twice
             whileX = eventX + 1
             // search forward for across
             while (this.createdGrid[eventY][whileX] && this.createdGrid[eventY][whileX]['isBlock'] != true) {
                 if (primaryDirection === "across") {
                     this.createdGrid[eventY][whileX]['isPrimarySelect'] = true
                 } else {
                     this.createdGrid[eventY][whileX]['isSecondarySelect'] = true
                 }
                 this.previousSelectAcross.push(whileX)
                 whileX++
             }
             
             var whileY = eventY - 1
             // search backwards for down
             while (this.createdGrid[whileY] && this.createdGrid[whileY][eventX]['isBlock'] != true) {
                 if (primaryDirection === "down") {
                     this.createdGrid[whileY][eventX]['isPrimarySelect'] = true
                 } else {
                     this.createdGrid[whileY][eventX]['isSecondarySelect'] = true
                 }
                 this.previousSelectDown.push(whileY)
                 whileY--
             }
             whileY = eventY + 1
             // search forward for across
             while (this.createdGrid[whileY] && this.createdGrid[whileY][eventX]['isBlock'] != true) {
                 if (primaryDirection === "down") {
                     this.createdGrid[whileY][eventX]['isPrimarySelect'] = true
                 } else {
                     this.createdGrid[whileY][eventX]['isSecondarySelect'] = true
                 }
                 this.previousSelectDown.push(whileY)
                 whileY++
             }
             //console.log(this.previousSelectAcross)
             //console.log(this.previousSelectDown)
             
             // 
             // console.log(event)
             // console.log('focusEar called')
             // let eventAcrossNum = event.acrossNum
             // let eventDownNum = event.downNum
             // let eventDirection = event.direction
             // console.log(eventAcrossNum)
             // console.log(eventDownNum)
             // console.log(eventDirection)
             // // the design decision to have mutable (is_select, etc) data alongside immutable data
             // // (isBlock, isRebus, etc) seems inelegant
             // 
             // // this is so inefficient lol
             // for (let row in this.createdGrid) {
             //     //console.log(this.createdGrid[row])
             //     for (let square = 0; square < this.createdGrid[row].length; square++) {
             //         //console.log(this.createdGrid[row][square])
             //         if (this.createdGrid[row][square]['acrossNum'] == eventAcrossNum && this.createdGrid[row][square]['downNum'] == eventDownNum) {
             //             //console.log('focusEar first branch (do nothing)')
             //         } else if (this.createdGrid[row][square]['acrossNum'] == eventAcrossNum || this.createdGrid[row][square]['downNum'] == eventDownNum) {
             //             //console.log('focusEar second branch (do stuff)')
             //             eventDirection === this.direction ? this.createdGrid[row][square]['isPrimarySelect'] = true : this.createdGrid[row][square]['isSecondarySelect'] = true
             //         } else {
             //             //console.log('focusEar third branch (clear)')
             //             this.createdGrid[row][square]['isPrimarySelect'] = false
             //             this.createdGrid[row][square]['isSecondarySelect'] = false
             //         }
             //     }
             // }

             //// code for listening on the component level
             // if (eventAcrossNum === this.acrossNum && eventDownNum === this.downNum) {
             //    // don't do anything for the same square (no logical xor in js lol)
             //    console.log('focusEar first branch (do nothing)')
             //     return
             // } else if (eventAcrossNum === this.acrossNum || eventDownNum === this.downNum) {
             //     // if the direction is the same, it's primary select. else, secondary
             //     console.log('focusEar second branch (do stuff)')
             //     eventDirection === this.direction ? this.isPrimarySelect = true : this.SecondarySelect = true
             // } else {
             //     console.log('focusEar third branch (clear)')
             //     this.isPrimarySelect = false
             //     this.isSecondarySelect = false
             // }
         }
     },
     mounted() {
         //this.createGrid(this.gridObject)
     }
 }
</script>
