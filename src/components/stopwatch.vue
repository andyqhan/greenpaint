<template>
    <span @click="toggleStopwatch">{{ formattedTime }}</span>
</template>

<script>
 export default {
     name: 'stopwatch',
     props: {
         isFinishedShow: Boolean,
     },

     data() {
         return {
             timerInterval: null,
             isStopwatchActive: true,
             countedTime: 0  // in seconds
         }
     },

     computed: {
         formattedTime() {
             let minutes = Math.floor(this.countedTime / 60);
             let seconds = this.countedTime % 60;
             if (seconds < 10) {
                 seconds = `0${seconds}`
             }
             return `${minutes}:${seconds}`
         }
     },
     
     methods: {
         startTimer() {
             this.timerInterval = setInterval(this.incrementTimer, 1000);
         },

         incrementTimer() {
             if (this.isStopwatchActive) {
                 this.countedTime += 1;
             }
         },

         toggleStopwatch() {
             this.isStopwatchActive = !this.isStopwatchActive;
         },

         stopStopwatch() {
             this.isStopwatchActive = false;
         },

         resetStopwatch() {
             this.countedTime = 0;
         }
     },

     mounted() {
         this.startTimer();
     }
 }
</script>

<style scoped>
 .span {
     padding: 10px;
     font-size: 16px;
     border: none;
     cursor: pointer;
     text-align: center;
 }
</style>
