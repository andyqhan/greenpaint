<template>
    <div>
        <grid :gridObject="puzzleGrid"></grid>
    </div>
    <div>
        <clueContainer :clues="cluesAcross" :direction="'A'"></clueContainer>
    </div>
    <div>
        <clueContainer :clues="cluesDown" :direction="'D'"></clueContainer>
    </div>
</template>

<script>
 import puzzle from './examples/circleex.json'
 import grid from './components/grid.vue'
 import clueContainer from './components/clueContainer.vue'

 export default {
     name: 'App',
     components: {
         grid,
         clueContainer
     },
     data() {
         return {
             puzzleGrid: puzzle.Grid,
             cluesAcross: puzzle.Across,
             cluesDown: puzzle.Down
         };
     }
}
</script>

<style>
#app {
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    margin-top: 60px;
    display: grid;
    grid-template-columns: 2fr 0.5fr 0.5fr;
    grid-template-rows: 1fr 1fr 8fr;
    column-gap: 1em;
 }
 .grid {
     border: 3pt solid;
 }
</style>
