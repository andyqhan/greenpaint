<template>
    <div class="dropdown"
         @mouseover="checkMouse = true; checkActive = true"
         @mouseleave="checkMouse = false; checkActive = false"
    >
        <button class="dropbtn"
                :style="styleToolbar('dropbtncheck')">Check</button>
        <div class="dropcontent" :style="styleToolbar('dropcontent')" v-if="checkActive">
            <div class="menuitem"
                 @mouseover="styleToolbar('menuitemhover')"
                 @mouseleave="styleToolbar('menuitemleave')"
                 @click="this.$emit('check-square')">Square</div>
            <div class="menuitem" @click="this.$emit('check-word')">Word</div>
            <div class="menuitem" @click="this.$emit('check-grid')">Grid</div>
        </div>
    </div>
    
    <div class="dropdown"
         @mouseover="revealMouse = true; revealActive = true"
         @mouseleave="revealMouse = false; revealActive = false"
    >
        <button class="dropbtn"
                :style="styleToolbar('dropbtnreveal')">Reveal</button>
        <div class="dropcontent" :style="styleToolbar('dropcontent')" v-if="revealActive">
            <div class="menuitem" @click="this.$emit('reveal-square')">Square</div>
            <div class="menuitem" @click="this.$emit('reveal-word')">Word</div>
            <div class="menuitem" @click="this.$emit('reveal-grid')">Grid</div>
        </div>
    </div>
    
    <div class="dropdown"
         @mouseover="clearMouse = true; clearActive = true"
         @mouseleave="clearMouse = false; clearActive = false"
    >
        <button class="dropbtn"
                :style="styleToolbar('dropbtnclear')">Clear</button>
        <div class="dropcontent" :style="styleToolbar('dropcontent')" v-if="clearActive">
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
            <stopwatch
                :isFinishedShow="isFinishedShow"
                ref="stopwatch">
            </stopwatch>
        </button>
    </div>
    
    <div class="dropdown">
        <button class="dropbtn"
                :style="styleToolbar('dropbtnsettings')"
                @click="toggleSettings"
                @mouseover="settingsMouse = true"
                @mouseleave="settingsMouse = false">
            Settings
        </button>
    </div>
    
    <div>
        <transition name="modal">
            <div v-show="isSettingsShow">
                <div class="overlay" @click.self="isSettingsShow = false;">
                    <div class="modal">
                        <settings ref="settings"
                                  @settings="this.$emit('settings-to-app', $event)"
                                  @puzzle-send="this.$emit('puzzle-send-to-app', $event)"
                        ></settings>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
 import stopwatch from './stopwatch.vue'
 import settings from './settings.vue'
 
 export default {
     name: 'toolbar',
     components: {
         stopwatch,
         settings
     },
     props: {
         currentPoint: Object,
         isFinishedShow: Boolean,
         settingsObject: Object
     },
     emits: ['check-square',
             'check-word',
             'check-grid',
             'reveal-square',
             'reveal-word',
             'reveal-grid',
             'clear-timer',
             'clear-grid',
             'rebus',
             'settings-to-app',
             'checkSquare',
             'checkWord',
             'checkGrid',
             'revealSquare',
             'revealWord',
             'revealGrid',
             'clearGrid',
             'settingsToApp',
             'puzzle-send-to-app',
             'puzzleSendToApp'
     ],

     data() {
         return {
             checkActive: false,
             checkMouse: false,
             revealActive: false,
             clearActive: false,
             revealMouse: false,
             clearMouse: false,
             rebusMouse: false,
             timeMouse: false,
             settingsMouse: false,
             isSettingsShow: false,
         }
     },

     methods: {
         // can't implement clickaway elegantly bc i didn't make the dropdowns
         // a component, so compromise with mouseover/leave

         toggleSettings() {
             this.$refs.stopwatch.stopStopwatch();
             this.isSettingsShow = !this.isSettingsShow;
         },

         clearStopwatch() {
             this.$refs.stopwatch.resetStopwatch();
         },

         styleToolbar(cl) {
             switch(cl) {
                 case "dropbtncheck":
                     if (this.checkMouse) {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.base1,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     } else {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.bg,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     }
                 case "dropbtnreveal":
                     if (this.revealMouse) {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.base1,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     } else {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.bg,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     }
                 case "dropbtnclear":
                     if (this.clearMouse) {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.base1,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     } else {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.bg,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     }
                 case "dropbtnrebus":
                     if (this.rebusMouse) {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.base1,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     } else {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.bg,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     }
                 case "dropbtntime":
                     if (this.timeMouse) {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.base1,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     } else {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.bg,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     }
                 case "dropbtnsettings":
                     if (this.settingsMouse) {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.base1,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     } else {
                         return {
                             backgroundColor: this.settingsObject.selectedTheme.bg,
                             color: this.settingsObject.selectedTheme.fg,
                         }
                     }
                 case "dropcontent":
                     return {
                         backgroundColor: this.settingsObject.selectedTheme.base1,
                         color: this.settingsObject.selectedTheme.fg,
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
 .modal {
     width: 500px;
     margin: 0px auto;
     padding: 20px;
     background-color: #fff;
     border-radius: 2px;
     box-shadow: 0 2px 8px 3px;
     transition: all 0.2s ease-in;
     font-family: Helvetica, Arial, sans-serif;
 }
 .fadeIn-enter {
     opacity: 0;
 }

 .fadeIn-leave-active {
     opacity: 0;
     transition: all 0.2s step-end;
 }

 .fadeIn-enter .modal,
 .fadeIn-leave-active.modal {
     transform: scale(1.1);
 }
 button {
     padding: 7px;
     margin-top: 10px;
     background-color: green;
     color: white;
     font-size: 1.1rem;
 }

 .overlay {
     position: fixed;
     top: 0;
     left: 0;
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%;
     height: 100%;
     background: #00000094;
     z-index: 999;
     transition: opacity 0.2s ease;
 }
</style>
