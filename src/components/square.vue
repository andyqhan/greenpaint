<template>
    <span :id="[x, y]" :tabindex="x" class=square :class="classObject" @click="selectSquare"
                       @keyup="keyHandler">{{ letter }}</span>
</template>

<script>
 export default {
     name: 'square',
     props: {
         x: Number,
         y: Number,
         isRebus: Boolean,
         isCircled: Boolean,
         isBlock: Boolean,
     },
     data() {
         return {
             letter: '',
             isPoint: false,
             
         };
     },
     computed: {
         classObject() {
             return {
                 point: this.isPoint,
                 // add like checked and incorrect and stuff like that
                 
                 // these two could probably be immutable in data
                 block: this.isBlock,
                 circle: this.isCircle && !this.isBlock
             }
         }
     },
     methods: {
         keyHandler(event) {
             if (!this.isPoint) {
                 // this should never happen
                 console.log('not ispoint')
                 return;
             }
             if (event.key == event.key.toLowerCase()) {
                 this.letter = event.key
             } // maybe add if it's uppercase do penciling
             console.log(event.key)
             console.log('keyHandler')
         },
         selectSquare() {
             // this is handled much better by the tabindex and focusing,
             // but i still might need it later for the clue highlighting
             this.isPoint = true;
             console.log('selected');
         }
     }
 }
</script>

<style scoped>
 .square{
     width: 50px;
     height: 50px;
     display: inline-block;
     font-size: 35px;
     font-weight: bold;
     text-align: center;
     /* i'm pretty sure that this isn't putting it in the exact middle */
     vertical-align: middle;
     color: #766;
     background-color: #A9A9A9;
 }
 span:focus{
     background-color: #eeee00;
     /* wtf is active */
     outline: none
 }
 /* .point{
    background-color: #eeee00;
    } */
</style>
