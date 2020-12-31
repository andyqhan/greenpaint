<template>
    <div v-if="loaded">
        <greenpaint :puzzledata="this.puzzleData"/>
    </div>
    <div v-if="loading">
        loading puzzle data...
    </div>
    <div v-if="uploadWait">
        <label for="upload-input">Load a JSON from <a href="https://github.com/jahorne/AcrossLiteToText">AcrossLiteToText</a>:</label>
        <br>
        <input id="upload-input" type="file" accept=".json" @change="processFile">
    </div>
</template>

<script>
 import greenpaint from './components/greenpaint.vue'
  export default {
     name: 'App',
     data() {
         return {
             puzzleData: Object,
             loaded: false,
             loading: true,
             uploadWait: false
         }
     },
     components: {
         greenpaint
     },
     methods: {
         async getPuzzleData() {
             let puzzlepath = document.getElementById('puzzlepath').text.slice(1, -1);
             let response = await fetch(puzzlepath);
             if (!response.ok) {
                 throw new Error(`Error getting puzzle data: ${response.status}`);
             }
             let puzzleData = await response.json();
             return puzzleData;
         },

         processFile() {
             let input = document.getElementById('upload-input');
             if (!input.files[0]) {
                 // case when there's no file selected
                 console.alert("no file selected")
                 return;
             } else {
                 let fileReader = new FileReader();
                 //let puzzleObj;
                 let parent = this;
                 fileReader.readAsText(input.files[0]);
                 fileReader.onload = function(e) {
                     parent.puzzleData = JSON.parse(e.target.result);
                     parent.uploadWait = false;
                     parent.loaded = true;
                     return;
                 }
             }
         },
     },
      async created() {
          if (document.getElementById('puzzlepath')) {
              // if there's a tag with the puzzlepath
              this.puzzleData = await this.getPuzzleData();
              this.loading = false;
              this.loaded = true;
          } else {
              // open greenpaint in upload json mode. to enable this behavior,
              // don't add an element with id="puzzlepath" in the DOM
              this.loading = false;
              this.uploadWait = true;
          }
      }
 }
</script>
