<template>
    <input type="text"
           v-model="keyString"
           @keydown.enter="enterKeyString"
    />
</template>

<script>
 export default {
     name: 'settingsInput',

     emits: ['valid-keybind'],

     data() {
         return {
             keyString: '',
         }
     },

     methods: {
         enterKeyString() {
             let bindArray = this.validateKeyString(this.keyString)
             if (bindArray !== null) {
                 this.$emit('valid-keybind', bindArray);
                 this.keyString = '';
             } else {
                 this.keyString="invalid binding!"
             }
         },

         isValidSingleKeyString(keyString) {
             // return true if keyString (a _single_ binding) is a valid binding
             let split = keyString.split('-');
             let legalSingles = ["Tab", "Space", "Backspace", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Enter"];
             let legalMods = ["Ctrl", "Shift"];
             if (split.length === 1) {
                 return legalSingles.includes(split[0])
             } else if (split.length === 2) {
                 return (legalMods.includes(split[0]) && (legalSingles.includes(split[1]) || /^\w$/.test(split[1])))
             } else {
                 return false
             }
         },

         validateKeyString(multiKeyString) {
             // return array of binds (string) if _all_ the bindings in the
             // comma-seperated list multiKeyString are valid
             let split = multiKeyString.split(',');
             for (let i=0; i < split.length; i++) {
                 if (!this.isValidSingleKeyString(split[i])) {
                     return null
                 }
             }
             return split
         }
     }
 }
</script>
