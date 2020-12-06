<template>
    <p class=singleClue>
        {{ clueObject.Num.toString() + direction + ": " + clueObject.Clue }}
    </p>
</template>

<script>
 export default {
     name: 'singleClue',
     props: {
         clueObject: Object,
         direction: String,
     }
 }
</script>
