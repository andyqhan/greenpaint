<template>
    <div class="dropdown">
        <button class="dropbtn" @click="toggleCheck">Check</button>
        <div class="dropcontent" v-if="checkActive">
            <div class="menuitem" @click="this.$emit('check-square')">Square</div>
            <div class="menuitem" @click="this.$emit('check-word')">Word</div>
            <div class="menuitem" @click="this.$emit('check-grid')">Grid</div>
        </div>
    </div>
    <div class="dropdown">
        <button class="dropbtn" @click="toggleReveal">Reveal</button>
        <div class="dropcontent" v-if="revealActive">
            <div class="menuitem" @click="this.$emit('reveal-square')">Square</div>
            <div class="menuitem" @click="this.$emit('reveal-word')">Word</div>
            <div class="menuitem" @click="this.$emit('reveal-grid')">Grid</div>
        </div>
    </div>
    <div class="dropdown">
        <button class="dropbtn" @click="toggleClear">Clear</button>
        <div class="dropcontent" v-if="revealClear">
            <div class="menuitem" @click="clearStopwatch">Time</div>
            <div class="menuitem" @click="this.$emit('clear-grid')">Grid</div>
        </div>
    </div>
    <button class="dropbtn" @click="this.$emit('rebus')">Rebus</button>
    <div class="dropdown">
        <stopwatch ref="stopwatch"></stopwatch>
    </div>
</template>

<script>
 //import check from './check.vue'
 import stopwatch from './stopwatch.vue'
 export default {
     components: {
         stopwatch
     },
     name: 'toolbar',
     props: {
         currentPoint: Object
     },
     emits: ['check-square',
             'check-word',
             'check-grid',
             'reveal-square',
             'reveal-word',
             'reveal-grid',
             'clear-timer',
             'clear-grid',
             'rebus'
     ],

     data() {
         return {
             checkActive: false,
             revealActive: false,
             revealClear: false,
         }
     },

     methods: {
         toggleCheck() {
             this.checkActive = !this.checkActive;
         },
         
         toggleReveal() {
             this.revealActive = !this.revealActive;
         },

         toggleClear() {
             this.revealClear = !this.revealClear;
         },

         clearStopwatch() {
             this.$refs.stopwatch.resetStopwatch();
         }
     },
 }
</script>

<style scoped>
 .dropbtn {
     background-color: #3498DB;
     color: white;
     padding: 10px;
     font-size: 16px;
     border: none;
     cursor: pointer;
     border-radius: 10px;
 }

 /* Dropdown button on hover & focus */
 .dropbtn:hover, .dropbtn:focus {
     /* background-color: #2980B9; */
     outline: none;
 }

 /* The container <div> - needed to position the dropdown content */
 .dropdown {
     position: relative;
     display: inline-block;
     padding-right: 5px;
 }

 /* Dropdown Content (Hidden by Default) */
 .dropcontent {
     position: absolute;
     background-color: #f1f1f1;
     width: 60px;
     padding: 5px;
     box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
     z-index: 1;
     display: block;
     border-radius: 10px;
 }

 .menuitem:hover {
     background-color: lightgrey;
     border-radius: 5px;
     padding-left: 1px;
     cursor: pointer;
 }
</style>
