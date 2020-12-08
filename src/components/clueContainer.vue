<template>
    <div class="clueContainer across">
        <singleClue v-for="clue in clues" :key="clue.Num"
                    @primary-clue-focus="primaryClueFocusEar($event)"
                    :clueObject="clue" :direction="direction" :clueFocus="clueFocus">
        </singleClue>
    </div>
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
     },

     methods: {
         primaryClueFocusEar(clueText) {
             this.$emit('primary-clue-focus-to-app', clueText)
         }
     }
 }
</script>

<style scoped>
 .clueContainer {
     width: 10em;
     /* will have to change height to the height of the whole app plus some margin */
     height: 30em;
     overflow: auto;
 }
</style>
