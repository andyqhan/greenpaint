<template>
    <div class="dropdown">
        <button class="dropbtn"
                :style="styleToolbar('dropbtncheck')"
                @mouseover="checkMouse = true"
                @mouseleave="checkMouse = false"
                @click="toggleCheck">Check</button>
        <div class="dropcontent" :style="styleToolbar('dropcontent')" v-if="checkActive">
            <div class="menuitem"
                 @mouseover="styleToolbar('menuitemhover')"
                 @mouseleave="styleToolbar('menuitemleave')"
                 @click="this.$emit('check-square')">Square</div>
            <div class="menuitem" @click="this.$emit('check-word')">Word</div>
            <div class="menuitem" @click="this.$emit('check-grid')">Grid</div>
        </div>
    </div>
    <div class="dropdown">
        <button class="dropbtn" :style="styleToolbar('dropbtnreveal')"
                @mouseover="revealMouse = true"
                @mouseleave="revealMouse = false"
                @click="toggleReveal">Reveal</button>
        <div class="dropcontent" :style="styleToolbar('dropcontent')" v-if="revealActive">
            <div class="menuitem" @click="this.$emit('reveal-square')">Square</div>
            <div class="menuitem" @click="this.$emit('reveal-word')">Word</div>
            <div class="menuitem" @click="this.$emit('reveal-grid')">Grid</div>
        </div>
    </div>
    <div class="dropdown">
        <button class="dropbtn"
                :style="styleToolbar('dropbtnclear')"
                @mouseover="clearMouse = true"
                @mouseleave="clearMouse = false"
                @click="toggleClear">Clear</button>
        <div class="dropcontent" :style="styleToolbar('dropcontent')" v-if="revealClear">
            <div class="menuitem" @click="clearStopwatch">Time</div>
            <div class="menuitem" @click="this.$emit('clear-grid')">Grid</div>
        </div>
    </div>
    <button class="dropbtn"
            :style="styleToolbar('dropbtnrebus')"
            @mouseover="rebusMouse = true"
            @mouseleave="rebusMouse = false"
            @click="this.$emit('rebus')">Rebus</button>
    <div class="dropdown">
        <button class="dropbtn"
                :style="styleToolbar('dropbtntime')"
                @mouseover="timeMouse = true"
                @mouseleave="timeMouse = false">
            <stopwatch ref="stopwatch"></stopwatch>
        </button>
    </div>
</template>

<script>
 //import check from './check.vue'
 import stopwatch from './stopwatch.vue'
 import colors from '../assets/doom-one.js'
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
             checkMouse: false,
             revealActive: false,
             revealClear: false,
             revealMouse: false,
             clearMouse: false,
             rebusMouse: false,
             timeMouse: false
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
         },

         styleToolbar(cl) {
             switch(cl) {
                 case "dropbtncheck":
                     if (this.checkMouse) {
                         return {
                             backgroundColor: colors.base1
                         }
                     } else {
                         return {
                             backgroundColor: colors.bg,
                             color: colors.fg,
                         }
                     }
                 case "dropbtnreveal":
                     if (this.revealMouse) {
                         return {
                             backgroundColor: colors.base1
                         }
                     } else {
                         return {
                             backgroundColor: colors.bg,
                             color: colors.fg,
                         }
                     }
                 case "dropbtnclear":
                     if (this.clearMouse) {
                         return {
                             backgroundColor: colors.base1
                         }
                     } else {
                         return {
                             backgroundColor: colors.bg,
                             color: colors.fg,
                         }
                     }
                 case "dropbtnrebus":
                     if (this.rebusMouse) {
                         return {
                             backgroundColor: colors.base1
                         }
                     } else {
                         return {
                             backgroundColor: colors.bg,
                             color: colors.fg,
                         }
                     }
                 case "dropbtntime":
                     if (this.timeMouse) {
                         return {
                             backgroundColor: colors.base1
                         }
                     } else {
                         return {
                             backgroundColor: colors.bg,
                             color: colors.fg,
                         }
                     }
                 case "dropcontent":
                     return {
                         backgroundColor: colors.base1
                     }
             }
             return null;
         }
     },
 }
</script>

<style scoped>
 .dropbtn {
     padding: 10px;
     font-size: 16px;
     border: none;
     cursor: pointer;
     border-radius: 10px;
     outline: none;
 }

 /* Dropdown button on hover & focus */
 .dropbtn:hover {
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
     width: 60px;
     padding: 5px;
     box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
     z-index: 1;
     display: block;
     border-radius: 10px;
 }

 .menuitem:hover {
     border-radius: 5px;
     padding-left: 1px;
     cursor: pointer;
 }
</style>
