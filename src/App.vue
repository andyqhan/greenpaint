<template>
    <div class="toolbar" :style="activeClueCSS">
        <toolbar :currentPoint="currentPoint"
         @check-square="checkEar('square')"
         @check-word="checkEar('word')"
         @check-grid="checkEar('grid')"
         @reveal-square="this.$refs.grid.revealSquare()"
         @reveal-word="this.$refs.grid.revealWord()"
         @reveal-grid="this.$refs.grid.revealGrid()"
         @clear-grid="this.$refs.grid.clearGrid()"
         @rebus="this.$refs.grid.activateRebus()"
        ></toolbar>
    </div>
    <div class="activeClue" :style="activeClueCSS">
        <p>{{ activeClue }}</p>
    </div>
    <div class="mainGrid">
        <grid @square-focus-to-app="squareFocusToAppEar($event)" :gridObject="puzzleGrid"
         :cluesAcross="cluesAcross" :cluesDown="cluesDown" :rebusObj="rebusObj" ref="grid"></grid>
    </div>
    <div class="cluesAcross">
        <clueContainer @primary-clue-focus-to-app="primaryClueFocusToAppEar($event)"
         :clueFocus="clueFocus" :clues="cluesAcross" :direction="'A'"></clueContainer>
    </div>
    <div class="cluesDown">
        <clueContainer @primary-clue-focus-to-app="primaryClueFocusToAppEar($event)"
        :clueFocus="clueFocus" :clues="cluesDown" :direction="'D'"></clueContainer>
    </div>
</template>

<script>
 import puzzle from './examples/rebusex.json'
 import grid from './components/grid.vue'
 import clueContainer from './components/clueContainer.vue'
 import toolbar from './components/toolbar.vue'
 
 export default {
     name: 'App',
     components: {
         grid,
         clueContainer,
         toolbar
     },
     data() {
         return {
             puzzleGrid: puzzle.Grid,
             rebusObj: puzzle.IsRebus,
             cluesAcross: puzzle.Across,
             cluesDown: puzzle.Down,

             clueFocus: {primary: '1A', secondary: '1D'},
             activeClue: '',
             currentPoint: {y: 0, x: 0}
         };
     },
     computed: {
         activeClueCSS() {
             return {
                 'grid-column-start': 1,
                 'grid-column-end': 3
             }
         },
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
             this.currentPoint = event.currentPoint;
         },
         
         primaryClueFocusToAppEar(clueText) {
             //console.log('primaryClueFocusToAppEar')
             this.activeClue = clueText
         },
         
         checkEar(scope) {
             // this is to try to avoid the warnings but they're still there
             // idk if it's the right way to do it though lol
             switch(scope) {
                 case "square":
                     this.$refs.grid.checkSquare();
                     break;
                 case "word":
                     this.$refs.grid.checkWord();
                     break;
                 case "grid":
                     this.$refs.grid.checkGrid();
                     break;
             }
         },
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
