<template>
    <span v-if="isRebusActive" class="rebusContainer">
        <input>
    </span>
    <span v-else :tabindex="isBlock ? null : -1" class=square :class="classObject"
                                          @click="selectSquare" 
                                          @keydown="keyHandler">{{ currentLetter }}
        <span class="cluenum-square">{{ cluenum }}</span>
    </span>
</template>

<script>
 // removed @click="selectSquare" from above
 
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
     },
     emits: ['square-focus'],
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

     }
 }
</script>

<style scoped>
 .square {
     width: 25px;
     height: 25px;
     display: inline-block;
     border: 1px solid;
     font-size: 20px;
     font-weight: normal;
     text-align: center;
     /* i'm pretty sure that this isn't putting it in the exact middle */
     vertical-align: middle;
     color: #000000;
     background-color: lightgray;
     cursor: default;
 }
 span:focus {
     outline: none
 }
 .block {
     background-color: #000000;
     border: 1px solid;
     border-color: background-color;
 }
 .circled {
     background-color: darkgray;
 }
 .primarySelect {
     background-color: #1874cd;
 }
 .secondarySelect {
     background-color: #6ca6cd;
 }
 .isPoint {
     background-color: #eeee00;
     /* wtf is active */
     outline: none
 }
 .isCorrect {
     /* TODO this is also coloring the borders */
     color: blue;
 }
 .isIncorrect {
     color: red;
 }
 .cluenum-square {
     /* this styling is almost certainly not robust and will break */
     position: relative;
     left: -6px;
     top: -10px;
     font-size: 10px;
     /* disable text selection */
     -webkit-user-select: none; /* Safari */        
     -moz-user-select: none; /* Firefox */
     -ms-user-select: none; /* IE10+/Edge */
     user-select: none; /* Standard */
 }
</style>
