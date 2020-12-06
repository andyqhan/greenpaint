<template>
    <div class="clueContainer across">
        <singleClue v-for="clue in clues" :key="clue.Num" :clueObject="clue" :direction="direction">
        </singleClue>
    </div>
</template>

<script>
 import singleClue from './singleClue.vue'
 
 export default {
     name: 'clues',
     components: {
         singleClue,
     },
     props: {
         clues: Array,
         direction: String,
     },
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
