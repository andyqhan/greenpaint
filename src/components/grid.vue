<template>
    <div class="row" v-for="(row, _, row_index) in gridObject" :key="row_index">
        <square v-for="(cell, cell_index) in row.Row.split('')"
                :key="[row_index, cell_index]"
                :correctLetter="cell"></square>
    </div>
</template>

<script>
 import square from './square.vue'
 
 export default {
     name: 'grid',
     components: {
         square
     },
     props: ['gridObject'],
     data() {
         return {
         }
     }
 }
</script>
