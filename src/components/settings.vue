<template>
    <div class="settings-container">
        <div>
            Option
        </div>
        <div>
            Current
        </div>
        <div>
            Customize
        </div>
        
        <div>
            Theme
        </div>
        <div>
            {{ theme }}
        </div>
        <div>
            <select>
                <option value="doom_one_light">doom_one_light</option>
                <option value="doom_one_dark">doom_one_dark</option>
                <option value="doom_zenburn">doom_zenburn</option>
                <option value="doom_wilmersdorf">doom_wilmersdorf</option>
                <option value="doom_vibrant">doom_vibrant</option>
                <option value="doom_spacegrey">doom_spacegrey</option>
                <option value="doom_solarized">doom_solarized</option>
                <option value="doom_solarized_dark">doom_solarized_dark</option>
                <option value="doom_snazzy">doom_snazzy</option>
                <option value="doom_rouge">doom_rouge</option>
                <option value="doom_peacock">doom_peacock</option>
                <option value="doom_palenight">doom_palenight</option>
                <option value="doom_outrun_electric">doom_outrun_electric</option>
                <option value="doom_opera">doom_opera</option>
                <option value="doom_opera_dark">doom_opera_dark</option>
                <option value="doom_old_hope">doom_old_hope</option>
                <option value="doom_oceanic_next">doom_oceanic_next</option>
                <option value="doom_nord">doom_nord</option>
                <option value="doom_nord_light">doom_nord_light</option>
                <option value="doom_moonlight">doom_moonlight</option>
                <option value="doom_monokai_pro">doom_monokai_pro</option>
                <option value="doom_molokai">doom_molokai</option>
                <option value="doom_miramare">doom_miramare</option>
                <option value="doom_material">doom_material</option>
                <option value="doom_manegram">doom_manegram</option>
                <option value="doom_laserwave">doom_laserwave</option>
                <option value="doom_horizon">doom_horizon</option>
                <option value="doom_henna">doom_henna</option>
                <option value="doom_fairy_floss">doom_fairy_floss</option>
                <option value="doom_ephemeral">doom_ephemeral</option>
                <option value="doom_dracula">doom_dracula</option>
                <option value="doom_dark_plus">doom_dark_plus</option>
                <option value="doom_city_lights">doom_city_lights</option>
                <option value="doom_challenger_dark">doom_challenger_dark</option>
                <option value="doom_acario_light">doom_acario_dark</option>
                <option value="doom_iosvkem">doom_iosvkem</option>
            </select>
        </div>
        
        <div>
            Upload json
        </div>
        <div>
            {{ uploadJson }}
        </div>
        <div>
            (button)
        </div>
        
        <div>
            Move right by square
        </div>
        <div>
            {{ moveRightSquare.toString() }}
        </div>
        <div>
            <input>
        </div>
        
         <div>
            Move left by square
         </div>
         <div>
             {{ moveLeftSquare.toString() }}
         </div>
         <div>
            <input>
        </div>
        
         <div>
            Move up by square
         </div>
         <div>
             {{ moveUpSquare.toString() }}
         </div>
         <div>
            <input>
        </div>
        
        <div>
            Move down by square
        </div>
        <div>
            {{ moveDownSquare.toString() }}
        </div>
        <div>
            <input>
        </div>

        <div>
            Delete square
        </div>
        <div>
            {{ deleteSquare.toString() }}
        </div>
        <div>
            <input>
        </div>
        
        <div>
            Move right by word
        </div>
        <div>
            {{ moveRightWord.toString() }}
        </div>
        <div>
            <input>
        </div>
         
         <div>
            Move left by word
         </div>
         <div>
             {{ moveLeftWord.toString() }}
         </div>
         <div>
            <input>
        </div>
        
        
        <div>
            Move to start of word
        </div>
        <div>
            {{ moveStartWord.toString() }}
        </div>
        <div>
            <input>
        </div>
        
        <div>
            Move to end of word
        </div>
        <div>
            {{ moveEndWord.toString() }}
        </div>
        <div>
            <input>
        </div>
        
        <div>
            Delete word
        </div>
        <div>
            {{ deleteWord.toString() }}
        </div>
        <div>
            <input>
        </div>
        
        <div>
            Switch direction
        </div>
        <div>
            {{ switchDirection.toString() }}
        </div>
        <div>
            <input>
        </div>
        
        <div class="apply-settings" @click="emitSettings">
            <button>Apply</button>
        </div>
    </div>
</template>

<script>
 import doom_zenburn from '../assets/doom_zenburn.json'
 import doom_wilmersdorf from '../assets/doom_wilmersdorf.json'
 import doom_vibrant from '../assets/doom_vibrant.json'
 import doom_spacegrey from '../assets/doom_spacegrey.json'
 import doom_solarized from '../assets/doom_solarized.json'
 import doom_solarized_dark from '../assets/doom_solarized_dark.json'
 import doom_snazzy from '../assets/doom_snazzy.json'
 import doom_rouge from '../assets/doom_rouge.json'
 import doom_peacock from '../assets/doom_peacock.json'
 import doom_palenight from '../assets/doom_palenight.json'
 import doom_outrun_electric from '../assets/doom_outrun_electrric.json'
 import doom_opera from '../assets/doom_opera.json'
 import doom_opera_dark from '../assets/doom_opera_dark.json'
 import doom_one from '../assets/doom_one.json'
 import doom_one_light from '../assets/doom_one_night.json'
 import doom_old_hope from '../assets/doom_old_hope.json'
 import doom_oceanic_next from '../assets/doom_oceanic_next.json'
 import doom_nord from '../assets/doom_nord.json'
 import doom_nord_light from '../assets/doom_nord_light.json'
 import doom_moonlight from '../assets/doom_moonlight.json'
 import doom_monokai_pro from '../assets/doom_monokai_pro.json'
 import doom_molokai from '../assets/doom_molokai.json'
 import doom_miramare from '../assets/doom_miramare.json'
 import doom_material from '../assets/doom_material.json'
 import doom_manegram from '../assets/doom_manegram.json'
 import doom_laserwave from '../assets/doom_laserwave.json'
 import doom_horizon from '../assets/doom_horizon.json'
 import doom_henna from '../assets/doom_henna.json'
 import doom_fairy_floss from '../assets/doom_fairy_floss.json'
 import doom_ephemeral from '../assets/doom_ephemeral.json'
 import doom_dracula from '../assets/doom_dracula.json'
 import doom_dark_plus from '../assets/doom_dark_plus.json'
 import doom_city_lights from '../assets/doom_city_lights.json'
 import doom_challenger_dark from '../assets/doom_challenger_dark.json'
 import doom_acario_light from '../assets/doom_acario_light.json'
 import doom_acario_dark from '../assets/doom_acario_dark.json'
 import doom_iosvkem from '../assets/doom_iosvkem.json' 
 
 export default {
     name: 'settings',

     data() {
         return {
             selectedTheme: 'doom_one_light',
             uploadJson: null,
             moveRightSquare: ["ArrowRight", "Ctrl-f"],
             moveLeftSquare: ["ArrowLeft", "Ctrl-b"],
             moveUpSquare: ["ArrowUp", "Ctrl-p"],
             moveDownSquare: ["ArrowDown", "Ctrl-n"],
             deleteSquare: ["Backspace", "Ctrl-d"],
             moveRightWord: ["Tab"],
             moveLeftWord: ["Shift-Tab"],
             moveStartWord: ["Ctrl-a"],
             moveEndWord: ["Ctrl-e"],
             deleteWord: ["Ctrl-k"],
             switchDirection: ["Space"],
         }
     },
     
     methods: {
         parseBind(bindString) {
             // parse bindString into a conditional statement that returns true if event corresponds to bindString
             // if bindString represents one key, it must be one of legalSingles
             // if bindString represents two keys, the first must be a modifier in legalMods and the second
             // must either be a single letter or be in the legalSingles
             let split = bindString.split('-');
             let legalSingles = ["Tab", "Space", "Backspace", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
             let legalMods = ["Ctrl", "Shift"]
             if (split.length === 1) {
                 // if there's no hyphen, and the bindString must be Tab, Space, Backspace, or an Arrow
                 if (split[0] === "Space") {
                     return "event.key === ' ' && event.ctrlKey === false && event.shiftKey === false";
                 } else if (legalSingles.includes(split[0])) {
                     // return a function that checks if event.key is the same as the bind
                     return `event.key === "${split[0]}" && event.ctrlKey === false && event.shiftKey === false`
                 } else {
                     console.log("parseBind: invalid binding");
                     return;
                 }
             } else if (split.length === 2) {
                 // if there's a modifier
                 if (legalMods.includes(split[0]) && (legalSingles.includes(split[1]) || /^\w$/.test(split[1]))) {
                     // validation: the first element must be in legalMods; the second must
                     // either be in legalSingles or be a single letter
                     return `event.${split[0].toLowerCase()}Key === true && event.key === "${split[1]}"`;
                 } else {
                     console.log("parseBind: invalid binding");
                     return;
                 }
             } else {
                 console.log("parseBind: invalid binding");
                 return;
             }
         },

         parseBindList(bindList) {
             // return a function that returns true if event corresponds to one
             // of the bindStrings in bindList
             let testString = "";
             let thisString = "";
             for (let i = 0; i < bindList.length-1; i++) {
                 // add the parsed element of bindList to testString, except the last one
                 thisString = this.parseBind(bindList[i]);
                 testString += `(${thisString}) || `;
             }
             // do the last element (no || after)
             thisString = this.parseBind(bindList[bindList.length-1]);
             testString += `(${thisString})`;
             return Function('event', `return ${testString}`);
         },

         createBindFunctionObject() {
             // hardcoded for readability. return an object with keys equal to
             // various grid operations and values equal to the function testing
             // if this event is a key in that key's bindList
             return {
                 moveRightSquare: this.parseBindList(this.moveRightSquare),
                 moveLeftSquare: this.parseBindList(this.moveLeftSquare),
                 moveUpSquare: this.parseBindList(this.moveUpSquare),
                 moveDownSquare: this.parseBindList(this.moveDownSquare),
                 deleteSquare: this.parseBindList(this.deleteSquare),
                 moveRightWord: this.parseBindList(this.moveRightWord),
                 moveLeftWord: this.parseBindList(this.moveLeftWord),
                 // moveUpWord: this.parseBindList(this.moveUpWord),
                 // moveDownWord: this.parseBindList(this.moveDownWord),
                 moveStartWord: this.parseBindList(this.moveStartWord),
                 moveEndWord: this.parseBindList(this.moveEndWord),
                 deleteWord: this.parseBindList(this.deleteWord),
                 switchDirection: this.parseBindList(this.switchDirection),
             }
         },

         getThemeObject(theme) {
             switch(theme) {
                 case "doom_zenburn":
                     this.selectedTheme = doom_zenburn;
                     break;
                 case "doom_wilmersdorf":
                     this.selectedTheme = doom_wilmersdorf;
                     break;
                 case "doom_vibrant":
                     this.selectedTheme = doom_vibrant;
                     break;
                 case "doom_spacegrey":
                     this.selectedTheme = doom_spacegrey;
                     break;
                 case "doom_solarized":
                     this.selectedTheme = doom_solarized;
                     break;
                 case "doom_solarized_dark":
                     this.selectedTheme = doom_solarized_dark;
                     break;
                 case "doom_snazzy":
                     this.selectedTheme = doom_snazzy;
                     break;
                 case "doom_rouge":
                     this.selectedTheme = doom_rouge;
                     break;
                 case "doom_peacock":
                     this.selectedTheme = doom_peacock;
                     break;
                 case "doom_palenight":
                     this.selectedTheme = doom_palenight;
                     break;
                 case "doom_outrun_electric":
                     this.selectedTheme = doom_outrun_electric;
                     break;
                 case "doom_opera":
                     this.selectedTheme = doom_opera;
                     break;
                 case "doom_opera_dark":
                     this.selectedTheme = doom_opera_dark;
                     break;
                 case "doom_one":
                     this.selectedTheme = doom_one;
                     break;
                 case "doom_one_light":
                     this.selectedTheme = doom_one_light;
                     break;
                 case "doom_old_hope":
                     this.selectedTheme = doom_old_hope;
                     break;
                 case "doom_oceanic_next":
                     this.selectedTheme = doom_oceanic_next;
                     break;
                 case "doom_nord":
                     this.selectedTheme = doom_nord;
                     break;
                 case "doom_nord_light":
                     this.selectedTheme = doom_nord_light;
                     break;
                 case "doom_moonlight":
                     this.selectedTheme = doom_moonlight;
                     break;
                 case "doom_monokai_pro":
                     this.selectedTheme = doom_monokai_pro;
                     break;
                 case "doom_molokai":
                     this.selectedTheme = doom_molokai;
                     break;
                 case "doom_miramare":
                     this.selectedTheme = doom_miramare;
                     break;
                 case "doom_material":
                     this.selectedTheme = doom_material;
                     break;
                 case "doom_manegram":
                     this.selectedTheme = doom_manegram;
                     break;
                 case "doom_laserwave":
                     this.selectedTheme = doom_laserwave;
                     break;
                 case "doom_horizon":
                     this.selectedTheme = doom_horizon;
                     break;
                 case "doom_henna":
                     this.selectedTheme = doom_henna;
                     break;
                 case "doom_fairy_floss":
                     this.selectedTheme = doom_fairy_floss;
                     break;
                 case "doom_ephemeral":
                     this.selectedTheme = doom_ephemeral;
                     break;
                 case "doom_dracula":
                     this.selectedTheme = doom_dracula;
                     break;
                 case "doom_dark_plus":
                     this.selectedTheme = doom_dark_plus;
                     break;
                 case "doom_city_lights":
                     this.selectedTheme = doom_city_lights;
                     break;
                 case "doom_challenger_dark":
                     this.selectedTheme = doom_challenger_dark;
                     break;
                 case "doom_acario_light":
                     this.selectedTheme = doom_acario_light;
                     break;
                 case "doom_acario_dark":
                     this.selectedTheme = doom_acario_dark;
                     break;
                 case "doom_iosvkem":
                     this.selectedTheme = doom_iosvkem;
                     break;
             }
         },

         createSettingsObject() {
             return {
                 selectedTheme: this.selectedTheme,
                 upload: this.uploadJson,
                 bindFunctionObject: this.createBindFunctionObject()
             }
         },

         emitSettings() {
             this.$emit('settings', this.createSettingsObject());
             console.log('emitted');
         }
     },

     created() {
         this.emitSettings()
     }
 }
</script>

<style scoped>
 .settings-container {
     display: grid;
     grid-template-columns: 1.5fr 1.5fr 1fr;
 }
 .apply-settings {
     grid-column: 3;
     justify-self: right;
 }
</style>
