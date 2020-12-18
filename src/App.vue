<template>
    <div class="app-container" :style="appStyle">
        <div>
        <transition name="modal">
            <div v-if="isFinishedShow">
                <div class="overlay" @click.self="isFinishedShow = false;">
                    <div class="modal">
                        <p> {{ gridFullMessage }} </p>
                    </div>
                </div>
            </div>
        </transition>
        </div>
        <div class="toolbar" :style="toolbarCSS">
            <toolbar ref="toolbar"
                :currentPoint="currentPoint"
             @check-square="checkEar('square')"
             @check-word="checkEar('word')"
             @check-grid="checkEar('grid')"
             @reveal-square="this.$refs.grid.revealSquare()"
             @reveal-word="this.$refs.grid.revealWord()"
             @reveal-grid="this.$refs.grid.revealGrid()"
             @clear-grid="this.$refs.grid.clearGrid()"
             @rebus="this.$refs.grid.activateRebus()"
             :isFinishedShow="isFinishedShow"
            ></toolbar>
        </div>
        <div class="activeClue" :style="activeClueCSS">
            <p>{{ activeClue }}</p>
        </div>
        <div class="mainGrid">
            <grid @square-focus-to-app="squareFocusToAppEar($event)"
            @grid-full="gridFullEar($event)"
            :gridObject="puzzleGrid"
            :cluesAcross="cluesAcross" :cluesDown="cluesDown" :rebusObj="rebusObj" ref="grid"></grid>
        </div>
        <p class="direction-label" :style="clueContStyle">Across</p>
        <div class="cluesAcross clue-container" :style="clueContStyle">
                <clueContainer
                    :style="clueContStyle"
                    @primary-clue-focus-to-app="primaryClueFocusToAppEar($event)"
                    :clueFocus="clueFocus"
                    :clues="cluesAcross"
                    :direction="'A'"></clueContainer>
        </div>
        <p class="direction-label" :style="clueContStyle">Down</p>
        <div class="cluesDown clue-container" :style="clueContStyle">
                <clueContainer
                    :style="clueContStyle"
                    @primary-clue-focus-to-app="primaryClueFocusToAppEar($event)"
                    :clueFocus="clueFocus"
                    :clues="cluesDown"
                    :direction="'D'"></clueContainer>
        </div>
    </div>
</template>

<script>
 import puzzle from './examples/rebusex.json'
 import grid from './components/grid.vue'
 import clueContainer from './components/clueContainer.vue'
 import toolbar from './components/toolbar.vue'
 import colors from './assets/doom-one.js'
 
 export default {
     name: 'App',
     components: {
         grid,
         clueContainer,
         toolbar,
     },
     data() {
         return {
             puzzleGrid: puzzle.Grid,
             rebusObj: puzzle.IsRebus,
             cluesAcross: puzzle.Across,
             cluesDown: puzzle.Down,

             clueFocus: {primary: '1A', secondary: '1D'},
             activeClue: '',
             currentPoint: {y: 0, x: 0},
             gridFullMessage: '',
             isFinishedShow: false,
         };
     },
     computed: {
         toolbarCSS() {
             return {
                 'grid-column-start': 1,
                 'grid-column-end': 3,
             }
         },
         
         activeClueCSS() {
             return {
                 gridColumn: 1,
                 backgroundColor: colors.green
             }
         },

         appStyle() {
             return {
                 backgroundColor: colors.bg
             }
         },

         clueContStyle() {
             return {
                 backgroundColor: colors.bgAlt
             }
         }
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
         
         primaryClueFocusToAppEar(clueEvent) {
             //console.log('primaryClueFocusToAppEar')
             this.activeClue = clueEvent.composed
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

         gridFullEar(event) {
             this.isFinishedShow = true;
             this.$refs.toolbar.$refs.stopwatch.stopStopwatch();
             if (event === "correct") {
                 this.gridFullMessage = "Congratulations! 🎉"
             } else if (event === "incorrect") {
                 this.gridFullMessage = "One or more letters are incorrect 😟"
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
     /* color: #2c3e50; */
 }
 .app-container {
     display: grid;
     grid-template-columns: 2fr 0.5fr 0.5fr;
     grid-template-rows: 1fr 1fr 10fr;
     column-gap: 1em;
     max-width: 870px;
     max-height: 600px;
     justify-items: start;
     padding: 1em;
     border-radius: 5px;
     box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
 }
 .grid {
     border: 3pt solid;
 }
 .toolbar {
     grid-row: 1;
     align-self: center;
 }
 .activeClue {
     grid-row: 2;
     align-self: center;
     width: stretch;
     padding-left: 1em;
     border-radius: 5px;
 }
 .mainGrid {
     grid-row: 3;
     grid-column: 1;
     min-width: 30em;
     padding-top: 1em;
 }
 .cluesAcross {
     grid-row: 3;
     grid-column: 2;
 }
 .cluesDown {
     grid-row: 3;
     grid-column: 3;
 }
 .direction-label {
     padding: 0.4em;
     width: 10em;
     border-radius: 5px;
 }
 .clue-container {
     padding: 0;
     height: 99%;
     padding-top: 0.4em;
     padding-left: 0.4em;
     padding-right: 0.4em;
     border-radius: 5px;
     width: 10em;
     /* will have to change height to the height of the whole app plus some margin */
     overflow: auto;
 }
 .modal {
     width: 500px;
     margin: 0px auto;
     padding: 20px;
     background-color: #fff;
     border-radius: 2px;
     box-shadow: 0 2px 8px 3px;
     transition: all 0.2s ease-in;
     font-family: Helvetica, Arial, sans-serif;
 }
 .fadeIn-enter {
     opacity: 0;
 }

 .fadeIn-leave-active {
     opacity: 0;
     transition: all 0.2s step-end;
 }

 .fadeIn-enter .modal,
 .fadeIn-leave-active.modal {
     transform: scale(1.1);
 }
 button {
     padding: 7px;
     margin-top: 10px;
     background-color: green;
     color: white;
     font-size: 1.1rem;
 }

 .overlay {
     position: fixed;
     top: 0;
     left: 0;
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%;
     height: 100%;
     background: #00000094;
     z-index: 999;
     transition: opacity 0.2s ease;
 }
</style>
