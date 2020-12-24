<template>
    <span :tabindex="isBlock ? null : -1" 
          class="square" :class="classObject"
          :style="squareStyle"
          @click="selectSquare" 
          @keydown="keyHandler"
          ref="square"
    >
        <span class="cluenum-square"
              :style="cluenumStyle"
        >{{ cluenum }}</span>
        <svg class="svg">
            <circle v-if="isCircled && !isWordStartAcross && !isWordStartDown"
                    cx="0.95em"
                    cy="0.95em"
                    r="13px"
                    :stroke="settingsObject.selectedTheme.fgAlt"
                    stroke-width="1px"
                    stroke-opacity="0.9"
                    fill-opacity="0"/>
            <g v-if="isCircled && (isWordStartAcross || isWordStartDown)"
               :stroke="settingsObject.selectedTheme.fgAlt"
               stroke-width="1px"
               stroke-opacity="0.9"
               fill-opacity="0">
                <path d="
                         M 14 2.5
                         A 13 13 0 1 1 2 15"/>
            </g>
        </svg>
        <span class="current-letter"
              :style="currentLetterStyle"
        > {{ currentLetter }} </span>
        <span v-show="isRebusActive" class="square rebusContainer" ref="rebusCont">
            <input v-model="rebusInput"
                   class="rebus-input"
                   style="text-transform: uppercase;"
                   :style="squareStyle"
                   @keydown.enter="this.$emit('rebus-enter', rebusInput)"
                   @focusout="this.$emit('rebus-blur', rebusInput)"
                   type="text"
                   ref="rebus"
            />
        </span>
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
     
     emits: ['square-focus', 'rebus-enter', 'rebus-blur'],
     
     data() {
         return {
             rebusInput: '',
         };
     },

     created() {
         this.$watch('isRebusActive', this.focusRebus, {
             immediate: true,
             deep: true
         })
     },
     
     computed: {
         
         classObject() {
             return {
                 block: this.isBlock,
                 circled: this.isCircled,
                 rebus: this.isRebus,
                 
                 primarySelect: this.isPrimarySelect,
                 secondarySelect: this.isSecondarySelect,
                 isPoint: this.isPoint,
                 isCorrect: this.isCorrect,
                 isIncorrect: this.isIncorrect,
                 isRebus: this.isRebusActive,
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

         focusRebus() {
             if (this.isRebusActive) {
                 this.$nextTick(() => {
                     this.$refs.rebus.focus();
                 });
             }
         }
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
     z-index: 2;
     /* disable text selection */
     -webkit-user-select: none; /* Safari */        
     -moz-user-select: none; /* Firefox */
     -ms-user-select: none; /* IE10+/Edge */
     user-select: none; /* Standard */
 }
 .rebusContainer {
     padding: 0;
     margin: 0;
     position: absolute;
     z-index: 1;
     width: 2.5em;
     height: 2em;
     /* borders or outline still appear... possibly inherited from square */
     border: none;
     outline: none;
 }
 .rebus-input {
     padding-left: 2px;
     padding-right: 2px;
     padding-top: 5px;
     padding-bottom: 5px;
     margin: 0;
     width: 100%;
     border: none;
     line-height: 140%;
     outline: none;
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
     overflow: hidden;
 }
 .current-letter {
     position: relative;
     top: 0.3em;
     left: 0.4em;
     font-size: 20px;
 }
 .block {
     border: 1px solid;
 }
 .isPoint {
     outline: none;
 }
 .svg {
     position: absolute;
     z-index: 0;
 }
</style>
