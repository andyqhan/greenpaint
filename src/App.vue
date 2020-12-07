<template>
    <div class="toolbar">
        <p>[placeholder for toolbar]</p>
    </div>
    <div class="activeClue">
        <p>[placeholder for active clue]</p>
    </div>
    <div class="mainGrid">
        <grid @square-focus-to-app="squareFocusToAppEar($event)" :gridObject="puzzleGrid"></grid>
    </div>
    <div class="cluesAcross">
        <clueContainer :clueFocus="clueFocus" :clues="cluesAcross" :direction="'A'"></clueContainer>
    </div>
    <div class="cluesDown">
        <clueContainer :clueFocus="clueFocus" :clues="cluesDown" :direction="'D'"></clueContainer>
    </div>
</template>

<script>
 import puzzle from './examples/circleex.json'
 import grid from './components/grid.vue'
 import clueContainer from './components/clueContainer.vue'

 export default {
     name: 'App',
     components: {
         grid,
         clueContainer
     },
     data() {
         return {
             puzzleGrid: puzzle.Grid,
             cluesAcross: puzzle.Across,
             cluesDown: puzzle.Down,

             clueFocus: {primary: '1A', secondary: '1D'},
         };
     },
     methods: {
         squareFocusToAppEar(event) {
             if (event.primaryDirection === 'across') {
                 this.clueFocus = {
                     primary: event.squareFocusEvent.acrossNum.toString() + 'A',
                     secondary: event.squareFocusEvent.downNum.toString() + 'D'
                 }
             } else if (event.primaryDirection === 'down') {
                 this.clueFocus = {
                     primary: event.squareFocusEvent.downNum.toString() + 'D',
                     secondary: event.squareFocusEvent.acrossNum.toString() + 'A',
                 }
             }
         }
     }
}
</script>

<style>
#app {
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    display: grid;
    grid-template-columns: 2fr 0.5fr 0.5fr;
    grid-template-rows: 1fr 1fr 8fr;
    column-gap: 1em;
 }
 .grid {
     border: 3pt solid;
 }
 .toolbar {
     grid-row: 1;
 }
 .activeClue {
     grid-row: 2;
 }
 .mainGrid {
     grid-row: 3;
     grid-column: 1;
 }
 .cluesAcross {
     grid-row: 3;
     grid-column: 2;
 }
 .cluesDown {
     grid-row: 3;
     grid-column: 3;
 }
</style>
