<template>
    <grid :gridObject="puzzleGrid"></grid>
</template>

<script>
 //import HelloWorld from './components/HelloWorld.vue'
 import puzzle from './examples/circleex.json'
 import grid from './components/grid.vue'

 export default {
     name: 'App',
     components: {
         grid,
     },
     data() {
         return { puzzleGrid: puzzle.Grid };
     }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
