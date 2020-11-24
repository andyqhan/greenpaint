<template>
    <div>
        <square :x=1 :y=1></square>
        <square :x=2 :y=1></square>
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
 }
</script>
