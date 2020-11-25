<template>
    <div class="row" v-for="(row, row_index) in gridObject" :key="row_index">
        <square v-for="(cell, cell_index) in row.Row.split('')"
                :key="[row_index, cell_index]"
                :id="[row_index, cell_index]"
                ref="[row_index, cell_index]"
                :correctLetter="cell"></square>
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
         }
     },
     methods: {
         selectCurrentPrimaryWord(rownum, colnum, direction) {
             if (direction == "horizontal") {
                 // hmm gotta figure out how to do this...
             }
         },
         // write function to get an array or object of word boundaries/indexes?
         // could make it out of the gridObject... and then pass emits from
         // square up to grid and then have grid take care of selection by comparing
         // the square's index with the word boundary index
         createGrid(gridObject) {
             // gridObject is actually an array lol
             var outputGrid = []
             var currentWordNum = 1
             for (let row in gridObject) {
                 let thisRowArray = gridObject[row]["Row"].split('')
                 outputGrid.push([])
                 for (let char in thisRowArray) {
                     var thisCell = {}
                     if (thisRowArray[char] == '.') {
                         thisCell['isBlock'] = thisRowArray[char] == '.'
                     } else {
                         thisCell['correctLetter'] = thisRowArray[char]
                         thisCell['isCircled'] = thisRowArray[char] == thisRowArray[char].toLowerCase()
                         thisCell['isRebus'] = !isNaN(parseInt(thisRowArray[char]), 10)
                         thisCell['isBlock'] = false

                         // char == 0 is when we're on the left edge of the grid
                         // the other condition is if the previous cell was a block
                         thisCell['isWordStartAcross'] = char == 0 || thisRowArray[char-1] == '.'
                         if (thisCell['isWordStartAcross']) {
                             thisCell['acrossStartNum'] = currentWordNum
                         }
                         // row == 0 is when we're on the top edge of the grid
                         // the other condition is if the cell above was a block
                         thisCell['isWordStartDown'] = row == 0 || outputGrid[row-1][char]['isBlock']
                         if (thisCell['isWordStartDown']) {
                             thisCell['downStartNum'] = currentWordNum
                         }
                         if (thisCell['isWordStartAcross'] || thisCell['isWordStartDown']) {
                             currentWordNum++
                         }
                     }
                     outputGrid[row].push(thisCell)
                 }
             }
             console.log(outputGrid)
         }
     },
     mounted() {
         this.createGrid(this.gridObject)
     }
 }
</script>
