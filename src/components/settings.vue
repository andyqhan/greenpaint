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
             moveRightWord: ["Tab", "Opt-f"],
             moveLeftWord: ["Shift-Tab", "Opt-b"],
             moveUpWord: ["Opt-p"],
             moveDownWord: ["Opt-n"],
             moveStartWord: ["Ctrl-a"],
             moveEndWord: ["Ctrl-e"],
             deleteWord: ["Opt-d"],
             switchDirection: ["Space"],
         }
     }
 }
</script>

<style scoped>
 .settings-container {
     display: grid;
     grid-template-columns: 1.5fr 1.5fr 1fr;
 }
</style>
