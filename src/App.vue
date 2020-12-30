<template>
    <div v-if="loaded">
        <greenpaint :puzzledata="this.puzzleData"/>
    </div>
    <div v-else>
        loading puzzle data...
    </div>
</template>

<script>
 import greenpaint from './components/greenpaint.vue'
  export default {
     name: 'App',
     data() {
         return {
             puzzleData: Object,
             loaded: false,
         }
     },
     components: {
         greenpaint
     },
     methods: {
         async getPuzzleData() {
             let puzzlepath = document.getElementById('puzzlepath').text.slice(1, -1);
             let response = await fetch(puzzlepath);
             if (!response.ok) {
                 throw new Error(`Error getting puzzle data: ${response.status}`);
             }
             let puzzleData = await response.json();
             return puzzleData;
         }
     },
     async created() {
         this.puzzleData = await this.getPuzzleData();
         this.loaded = true;
     }
 }
</script>
