<template>
    <span :tabindex="isBlock ? null : -1" class=square :class="classObject"
                                          @click="selectSquare"
                                          @focus="$emit('square-focus', {acrossNum: this.acrossNum,
                                              downNum: this.downNum, direction: this.direction, x: this.x, y: this.y})"
                                          @keyup="keyHandler">{{ letter }}</span>
    <!-- might have to do tabindex = -1, since i'll have to custom-handle tabing -->
</template>

<script>
 export default {
     name: 'square',
     props: {
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

         direction: String,

         isSecondarySelect: Boolean,
         isPrimarySelect: Boolean,
     },
     data() {
         return {
             letter: '',  // rename to currentLetter
             //isPoint: false,
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
             }
         }
     },
     methods: {
         keyHandler(event) {
             if (event.key === event.key.toLowerCase()) {
                 this.letter = event.key.toUpperCase()
             } // maybe add if it's uppercase do penciling
             console.log(event.key)
             console.log('keyHandler')
         },
         
         selectSquare() {
             // this is handled much better by the tabindex and focusing,
             // but i still might need it later for the clue highlighting
             // maybe @onclick, i want to switch direction?
             //this.isPoint = true;
             console.log('selected');
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
 }
 span:focus {
     background-color: #eeee00;
     /* wtf is active */
     outline: none
 }
 .block {
     background-color: #000000;
 }
 .circle {
     background-color: darkgray;
 }
 .primarySelect {
     background-color: #1874cd;
 }
 .secondarySelect {
     background-color: #6ca6cd;
 }
 /* .point{
    background-color: #eeee00;
    } */
</style>
