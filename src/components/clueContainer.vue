<template>
        <singleClue v-for="clue in clues" :key="clue.Num" :ref="clue.Num.toString()+direction"
                    @primary-clue-focus="primaryClueFocusEar($event)"
                    :clueObject="clue" :direction="direction" :clueFocus="clueFocus"
                    :settingsObject="settingsObject"
        ></singleClue>
</template>

<script>
 import singleClue from './singleClue.vue'
 
 export default {
     name: 'clues',
     emits: ['primary-clue-focus-to-app'],
     components: {
         singleClue,
     },
     
     props: {
         clues: Array,
         direction: String,
         clueFocus: Object,
         settingsObject: Object,
     },

     methods: {
         primaryClueFocusEar(clueEvent) {
             this.$emit('primary-clue-focus-to-app', clueEvent)
         },
     },
     
     updated() {
         // not all that elegant but ok
         let scrollClue;
         if (this.clueFocus.primary[this.clueFocus.primary.length-1] === this.direction) {
             // if the primary focus's direction is the same as current direction
             scrollClue = this.clueFocus.primary;
         } else if (this.clueFocus.secondary[this.clueFocus.secondary.length-1] === this.direction) {
             scrollClue = this.clueFocus.secondary;
         }
         this.$refs[scrollClue].$el.scrollIntoView();
     }
 }
</script>

<style scoped>
 .clueContainer {
    
 }
</style>
