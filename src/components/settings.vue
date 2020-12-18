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
                <option value="doom-one-light">doom-one-light</option>
                <option value="doom-one-dark">doom-one-dark</option>
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
            Move up by word
         </div>
         <div>
             {{ moveUpWord.toString() }}
         </div>
         <div>
            <input>
        </div>
        
         <div>
            Move down by word
         </div>
         <div>
             {{ moveDownWord.toString() }}
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
 export default {
     name: 'settings',

     data() {
         return {
             theme: 'doom-one-light',
             uploadJson: null,
             moveRightSquare: ["ArrowRight", "Ctrl-f"],
             moveLeftSquare: ["ArrowLeft"],
             moveUpSquare: ["ArrowUp"],
             moveDownSquare: ["ArrowDown"],
             deleteSquare: ["Backspace", "Ctrl-d"],
             moveRightWord: ["Tab", "Alt-f"],
             moveLeftWord: ["Shift-Tab", "Alt-b"],
             moveUpWord: ["Alt-p"],
             moveDownWord: ["Alt-n"],
             moveStartWord: ["Ctrl-a"],
             moveEndWord: ["Ctrl-e"],
             deleteWord: ["Alt-d"],
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
             let legalMods = ["Ctrl", "Shift", "Alt"]
             if (split.length === 1) {
                 // if there's no hyphen, and the bindString must be Tab, Space, Backspace, or an Arrow
                 if (split[0] === "Space") {
                     return "event.key === ' '";
                 } else if (legalSingles.includes(split[0])) {
                     // return a function that checks if event.key is the same as the bind
                     return `event.key === "${split[0]}"`
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
                 moveUpWord: this.parseBindList(this.moveUpWord),
                 moveDownWord: this.parseBindList(this.moveDownWord),
                 moveStartWord: this.parseBindList(this.moveStartWord),
                 moveEndWord: this.parseBindList(this.moveEndWord),
                 deleteWord: this.parseBindList(this.deleteWord),
                 switchDirection: this.parseBindList(this.switchDirection),
             }
         },

         createSettingsObject() {
             return {
                 theme: this.theme,
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
