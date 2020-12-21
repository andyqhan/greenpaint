<template>
    <span v-if="isRebusActive" class="square rebusContainer">
        <input v-model="rebusInput"
               style="text-transform: uppercase;"
               :style="squareStyle"
               @keydown.enter="this.$emit('rebus-enter', rebusInput)">
    </span>
    <span v-else :tabindex="isBlock ? null : -1" 
          class="square" :class="classObject"
          :style="squareStyle"
          @click="selectSquare" 
          @keydown="keyHandler">
        <span class="cluenum-square"
              :style="cluenumStyle"
        >{{ cluenum }}</span>
        <span class="current-letter"
              :style="currentLetterStyle"
        > {{ currentLetter }} </span>
    </span>
</template>

<script>
 export default {
     name: 'square',
     props: {
         // static
         x: Number,
         y: Number,
         correctLetter: String,
         isBlock: Boolean,
         isCircled: Boolean,
         isRebus: Boolean,         
         isWordStartAcross: Boolean,
         isWordStartDown: Boolean,
         acrossNum: Number,
         downNum: Number,

         // dynamic
         currentLetter: String,
         currentDirection: String,
         isSecondarySelect: Boolean,
         isPrimarySelect: Boolean,
         isPoint: Boolean,
         isCorrect: Boolean,
         isIncorrect: Boolean,
         isRebusActive: Boolean,

         settingsObject: Object,
     },
     emits: ['square-focus', 'rebus-enter'],
     data() {
         return {
             //letter: '',  // TODO rename to currentLetter maybe
             // direction: "across",
         };
     },
     computed: {
         classObject() {
             return {
                 //point: this.isPoint,
                 // add like checked and incorrect classes for styling and
                 // stuff like that
                 
                 // these two could probably be immutable in data
                 block: this.isBlock,
                 circled: this.isCircled,
                 rebus: this.isRebus,
                 
                 primarySelect: this.isPrimarySelect,
                 secondarySelect: this.isSecondarySelect,
                 isPoint: this.isPoint,
                 isCorrect: this.isCorrect,
                 isIncorrect: this.isIncorrect
             }
         },
         
         cluenum() {
             if (this.isWordStartAcross === true) {
                 return this.acrossNum;
             } else if (this.isWordStartDown === true) {
                 return this.downNum;
             } else {
                 return null;
             }
         },

         cluenumStyle() {
             return {
                 color: this.settingsObject.selectedTheme.fg
             }
         },

         currentLetterStyle() {
             if (this.isCorrect) {
                 return {
                     color: this.settingsObject.selectedTheme.blue,
                     borderColor: this.settingsObject.selectedTheme.fg,
                 }
             }
             if (this.isIncorrect) {
                 return {
                     color: this.settingsObject.selectedTheme.red,
                     borderColor: this.settingsObject.selectedTheme.fg,
                 }
             } else {
                 return {
                     color: this.settingsObject.selectedTheme.fg
                 }
             }
         },

         squareStyle() {
             if (this.isBlock) {
                 return {
                     backgroundColor: this.settingsObject.selectedTheme.fg,
                     color: this.settingsObject.selectedTheme.fg
                 }
             }
             if (this.isPoint) {
                 return {
                     backgroundColor: this.settingsObject.selectedTheme.green,
                     color: this.settingsObject.selectedTheme.fg
                 }
             }
             if (this.isPrimarySelect) {
                 return {
                     backgroundColor: this.settingsObject.selectedTheme.darkBlue,
                     color: this.settingsObject.selectedTheme.fg
                 }
             }
             if (this.isSecondarySelect) {
                 return {
                     backgroundColor: this.settingsObject.selectedTheme.base2,
                     color: this.settingsObject.selectedTheme.fg
                 }
             } else {
                 // it's a normal square
                 return {
                     color: this.settingsObject.selectedTheme.fg,
                 } 
             }
         }
     },
     methods: {
         keyHandler() {
             if (event.key === event.key.toLowerCase()) {
                 this.letter = event.key.toUpperCase()
             } // maybe add if it's uppercase do penciling
             //console.log(event.key)
             //console.log('keyHandler')
         },
         
         selectSquare() {
             // this is handled much better by the tabindex and focusing,
             // but i still might need it later for the clue highlighting
             // maybe @click, i want to switch direction?
             if (this.isBlock != true) {
                 this.$emit('square-focus', {
                     acrossNum: this.acrossNum,
                     downNum: this.downNum,
                     direction: this.currentDirection,
                     x: this.x,
                     y: this.y,
                 });
                 //console.log('selected');   
             }
         },
     },
 }
</script>

<style scoped>
 .cluenum-square {
     position: absolute;
     float: left;
     font-size: 10px;
     white-space: nowrap;
     margin-left: 1px;
     margin-top: -1px;
     /* disable text selection */
     -webkit-user-select: none; /* Safari */        
     -moz-user-select: none; /* Firefox */
     -ms-user-select: none; /* IE10+/Edge */
     user-select: none; /* Standard */
 }
 .rebusContainer {
     width: 25px;
     height: 30px;
     z-index: 1;
 }
 span:focus {
     outline: none
 }
 .square {
     display: inline-block;
     border: 1px solid;
     font-weight: normal;
     cursor: default;
     white-space: nowrap;
 }
 .current-letter {
     position: relative;
     top: 0.35em;
     left: 0.4em;
     font-size: 20px;
 }
 .block {
     border: 1px solid;
 }
 .isPoint {
     outline: none;
 }
</style>
