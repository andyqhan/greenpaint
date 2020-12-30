<template>
    <singleClue v-for="clue in clues"
                :key="clue.Num"
                :ref="clue.Num.toString()+direction"
                @primary-clue-focus="primaryClueFocusEar($event)"
                :clueObject="clue"
                :direction="direction"
                :clueFocus="clueFocus"
                :settingsObject="settingsObject"
                @clue-click="clueClickToAppEar($event)"
        ></singleClue>
</template>

<script>
 import singleClue from './singleClue.vue'
 
 export default {
     name: 'clues',
     emits: [
         'primary-clue-focus-to-app',
         'primaryClueFocusToApp',
         'clue-click-to-app',
         'clueClickToApp'
     ],
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

         clueClickToAppEar(event) {
             this.$emit('clue-click-to-app', event)
         }
     },
     
     updated() {
         // not all that elegant but ok
         if (this.$refs[this.clueFocus.primary]) {
             this.$refs[this.clueFocus.primary].$el.scrollIntoView();
         } else if (this.$refs[this.clueFocus.secondary]) {
             this.$refs[this.clueFocus.secondary].$el.scrollIntoView();
         }
     }
 }
</script>

