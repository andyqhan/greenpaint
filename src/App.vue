<template>
    <div class="app-container" :style="appStyle">
        <div>
            <transition name="modal">
                <div v-if="isFinishedShow">
                    <div class="overlay" @click.self="isFinishedShow = false;">
                        <div class="modal" :style="modalStyle">
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
                     @settings-to-app="settingsObject = $event"
                     @puzzle-send-to-app="setPuzzle($event)"
                     @settings-shown="this.$refs.grid.removeKeyEventListener()"
                     @settings-hidden="this.$refs.grid.addKeyEventListener()"
                     :isFinishedShow="isFinishedShow"
                     :settingsObject="settingsObject"
            ></toolbar>
        </div>
        <div class="activeClue" :style="activeClueCSS">
            <p>{{ activeClue }}</p>
        </div>
        <div class="mainGrid">
            <grid
                @square-focus-to-app="squareFocusToAppEar($event)"
                @grid-full="gridFullEar($event)"
                :gridObject="puzzleGrid"
                :settingsObject="settingsObject"
                :cluesAcross="cluesAcross"
                :cluesDown="cluesDown"
                :rebusObj="rebusObj"
                ref="grid"
                :key="gridKey"
            ></grid>
        </div>
        <p class="direction-label" :style="clueContStyle">Across</p>
        <div class="cluesAcross clue-container" :style="clueContStyle">
            <clueContainer
                @primary-clue-focus-to-app="primaryClueFocusToAppEar($event)"
                :clueFocus="clueFocus"
                :clues="cluesAcross"
                :direction="'A'"
                :settingsObject="settingsObject"
                @clue-click-to-app="clueClickToAppEar($event)"
                :key="acrossClueContKey"
            ></clueContainer>
        </div>
        <p class="direction-label" :style="clueContStyle">Down</p>
        <div class="cluesDown clue-container" :style="clueContStyle">
            <clueContainer
                @primary-clue-focus-to-app="primaryClueFocusToAppEar($event)"
                :clueFocus="clueFocus"
                :clues="cluesDown"
                :direction="'D'"
                :settingsObject="settingsObject"
                @clue-click-to-app="clueClickToAppEar($event)"
                :key="downClueContKey"
            ></clueContainer>
        </div>
        <div class="bylineCont" :style="bylineStyle">
            <span class="title">
                {{ puzzleTitle }}
            </span>
            <span class="author">
                {{ puzzleAuthor }}
            </span>
            <span class="copyright">
                {{ puzzleCopyright  }}
            </span>
        </div>
    </div>
</template>

<script>
 import grid from './components/grid.vue'
 import clueContainer from './components/clueContainer.vue'
 import toolbar from './components/toolbar.vue'
 import puzzle from './examples/circleex.json'
 
 export default {
     name: 'App',
     components: {
         grid,
         clueContainer,
         toolbar,
     },
     
     //props: ['puzzle'],
     
     data() {
         return {
             puzzleTitle: puzzle.Title,
             puzzleAuthor: puzzle.Author,
             puzzleCopyright: puzzle.Copyright,
             
             puzzleGrid: puzzle.Grid,
             rebusObj: puzzle.IsRebus,
             cluesAcross: puzzle.Across,
             cluesDown: puzzle.Down,
             gridKey: 0,
             acrossClueContKey: 47,
             downClueContKey: 48,

             clueFocus: {primary: '1A', secondary: '1D'},
             activeClue: '',
             currentPoint: {y: 0, x: 0},
             gridFullMessage: '',
             isFinishedShow: false,
             settingsObject: {
                 selectedTheme: {
                     "bg": "#fafafa",
                     "bgAlt": "#f0f0f0",
                     "base0": "#f0f0f0",
                     "base1": "#e7e7e7",
                     "base2": "#dfdfdf",
                     "base3": "#c6c7c7",
                     "base4": "#9ca0a4",
                     "base5": "#383a42",
                     "base6": "#202328",
                     "base7": "#1c1f24",
                     "base8": "#1b2229",
                     "fg": "#383a42",
                     "fgAlt": "#c6c7c7",
                     "red": "#e45649",
                     "orange": "#da8548",
                     "green": "#50a14f",
                     "teal": "#4db5bd",
                     "yellow": "#986801",
                     "blue": "#4078f2",
                     "darkBlue": "#a0bcf8",
                     "magenta": "#a626a4",
                     "violet": "#b751b6",
                     "cyan": "#0184bc",
                     "darkCyan": "#005478"
                 }
             }
         };
     },
     computed: {
         toolbarCSS() {
             return {
                 'grid-column-start': 1,
                 'grid-column-end': 4,
             }
         },
         
         activeClueCSS() {
             return {
                 gridColumn: 1,
                 backgroundColor: this.settingsObject.selectedTheme.green,
                 color: this.settingsObject.selectedTheme.bgAlt,
             }
         },

         appStyle() {
             return {
                 backgroundColor: this.settingsObject.selectedTheme.bg
             }
         },

         clueContStyle() {
             return {
                 backgroundColor: this.settingsObject.selectedTheme.bgAlt,
                 color: this.settingsObject.selectedTheme.fg,
             }
         },

         modalStyle() {
             return {
                 backgroundColor: this.settingsObject.selectedTheme.bg
             }
         },

         bylineStyle() {
             return {
                 color: this.settingsObject.selectedTheme.fg,
             }
         }
     },
     methods: {
         // setPuzzle(event) {
         //     //console.log(event);
         //     this.puzzle = event;
         //     this.puzzleGrid = event.Grid;
         //     this.rebusObj = event.IsRebus;
         //     this.cluesAcross = event.Across;
         //     this.cluesDown = event.Down;
         //     this.gridKey += 1;  // force update grid
         //     this.acrossClueContKey += 2;
         //     this.downClueContKey += 2;
         //     //this.$forceUpdate();
         // },
         
         squareFocusToAppEar(event) {
             // console.log(event)
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
         },

         clueClickToAppEar(event) {
             this.$refs.grid.focusFromClueClick(event);
         }
     },

     mounted() {
         // console.log(this.settingsObject)
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
     float: left;
     width: 100%;
 }
 .activeClue {
     grid-column: 1;
     grid-row: 2;
     align-self: center;
     width: stretch;
     padding-left: 1em;
     padding-right: 1em;
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
     grid-row: 2;
 }
 .clue-container {
     padding: 0;
     height: 99%;
     padding-top: 0.4em;
     padding-left: 0.4em;
     padding-right: 0.4em;
     border-radius: 5px;
     overflow: scroll;
     font-size: 14px;
     cursor: pointer;
     z-index: 2;
 }
 .modal {
     width: 500px;
     margin: 0px auto;
     padding: 20px;
     border-radius: 5px;
     box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
     transition: all 0.2s ease-in;
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
 .overlay {
     position: fixed;
     top: 0.5em;
     left: 0.5em;
     border-radius: 5px;
     width: 870px;
     height: 600px;
     padding: 1em;
     display: flex;
     justify-content: center;
     align-items: center;
     background: #00000094;
     z-index: 999;
     transition: opacity 0.2s ease;
 }
 .bylineCont {
     grid-column: 1 / 4;
     display: inline-block;
     width: 870px;
 }
 .bylineCont > span {
     font-size: 12px;
     padding-top: 0.15em;
     padding-left: 0.1em;
     padding-right: 0.1em;
     display: inline-block;
 }
 .title {
     float: left;
     margin-right: 2em;
 }
 .author {
     float: left;
 }
 .copyright {
     float: right;
 }
</style>
