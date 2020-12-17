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
             deleteSquare: ["Backspace"],
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
             // parse bindString into a function that returns true if event.key is the bindString
             // if bindString represents one key, it must be one of legalSingles
             // if bindString represents two keys, the first must be a modifier in legalMods and the second
             // must either be a single letter or be in the legalSingles
             let split = bindString.split('-');
             let funcString = '';
             let legalSingles = ["Tab", "Space", "Backspace", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
             let legalMods = ["Ctrl", "Shift", "Alt"]
             if (split.length === 1) {
                 // if there's no hyphen, and the bindString must be Tab, Space, Backspace, or an Arrow
                 if (legalSingles.includes(split[0])) {
                     // return a function that checks if event.key is the same as the bind
                     funcString = `return event.key === ${split[0]}`
                     return Function('event', funcString)
                 } else {
                     console.log("parseBind: invalid binding");
                     return;
                 }
             } else if (split.length === 2) {
                 // if there's a modifier
                 if (legalMods.includes(split[0]) && (legalSingles.includes(split[1]) || /^\w$/.test(split[1]))) {
                     // validation: the first element must be in legalMods; the second must
                     // either be in legalSingles or be a single letter
                     funcString = `return event.${split[0].toLowerCase()}Key === true && event.key === ${split[1]}`;
                     return Function('event', funcString);
                 } else {
                     console.log("parseBind: invalid binding");
                     return;
                 }
             } else {
                 console.log("parseBind: invalid binding");
                 return;
             }
         }
     },

     mounted() {
         console.log(this.parseBind('Shift-Tab'));
     }
 }
</script>

<style scoped>
 .settings-container {
     display: grid;
     grid-template-columns: 1.5fr 1.5fr 1fr;
 }
</style>
