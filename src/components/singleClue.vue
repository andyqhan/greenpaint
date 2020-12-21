<template>
    <p class="singleClue" :style="whichFocus" @click="clueClickEar">
        {{ clueKey + ": " + clueObject.Clue }}
    </p>
</template>

<script>
 export default {
     name: 'singleClue',
     emits: [
         'primary-clue-focus',
         'secondary-clue-focus',
         'clue-click'
     ],
     props: {
         clueObject: Object,
         direction: String,  // either 'A' or 'D'
         clueFocus: Object,
         settingsObject: Object,
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
                     return {
                         backgroundColor: this.settingsObject.selectedTheme.darkBlue,
                         padding: "0.3em",
                         borderRadius: "5px"
                         //color: this.settingsObject.selectedTheme.fgAlt
                     }
                 } else {
                     return null
                 }
             } else if (this.direction === secondaryFocusDirection) {
                 if (this.clueNum === secondaryFocusNum) {
                     this.$emit('secondary-clue-focus',
                                {clueNum: this.clueNum});
                     return {
                         backgroundColor: this.settingsObject.selectedTheme.base2,
                         padding: "0.3em",
                         borderRadius: "5px"
                         //color: this.settingsObject.selectedTheme.fgAlt
                     }
                 } else {
                     return null
                 }
             } else {
                 return null   
             }
         }
     },

     methods: {
         clueClickEar() {
             this.$emit('clue-click', {
                 num: this.clueObject.Num,
                 direction: this.direction
             })
         }
     }
 }
</script>
