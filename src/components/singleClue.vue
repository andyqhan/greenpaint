<template>
    <p class="singleClue" :class="whichFocus">
        {{ clueKey + ": " + clueObject.Clue }}
    </p>
</template>

<script>
 export default {
     name: 'singleClue',
     emits: ['primary-clue-focus', 'secondary-clue-focus'],
     props: {
         clueObject: Object,
         direction: String,  // either 'A' or 'D'
         clueFocus: Object,
     },
     data() {
         return {
             clueNum: this.clueObject.Num,
         }
     },
     computed: {
         clueKey() {
             return this.clueNum.toString() + this.direction;
         },
         whichFocus() {
             //console.log('whichFocus called')
             //console.log(this.clueFocus)
             let primaryFocusDirection = this.clueFocus.primary.slice(-1);
             let primaryFocusNum = Number(this.clueFocus.primary.slice(0, -1));
             let secondaryFocusDirection = this.clueFocus.secondary.slice(-1);
             let secondaryFocusNum = Number(this.clueFocus.secondary.slice(0, -1));

             if (this.direction === primaryFocusDirection) {
                 //console.log('first branch')
                 if (this.clueNum === primaryFocusNum) {
                     //console.log('returning primary')
                     // this emit will be heard in the active clue component
                     //this.$refs[scrollNum].scrollIntoView()
                     this.$emit('primary-clue-focus',
                                {composed: this.clueKey + ": " + this.clueObject.Clue,
                                 clueNum: this.clueNum});
                     return 'primary'
                 } else {
                     return null
                 }
             } else if (this.direction === secondaryFocusDirection) {
                 if (this.clueNum === secondaryFocusNum) {
                     this.$emit('secondary-clue-focus',
                                {clueNum: this.clueNum});
                     return 'secondary'
                 } else {
                     return null
                 }
             }
             return null
         },
     },
     methods: {
         
     }
 }
</script>

<style scoped>
 .primary {
     background-color: #1874cd;
 }
 .secondary {
     background-color: #6ca6cd;
 }
</style>
