<template>
    <div v-if="loaded">
        <greenpaint :puzzledata="this.puzzleData"/>
    </div>
    <div v-if="loading">
        loading puzzle data...
    </div>
    <div v-if="uploadWait">
        <label for="upload-input">
            Load a JSON from <a href="https://github.com/jahorne/AcrossLiteToText">AcrossLiteToText</a>, or a puz binary file:
        </label>
        <br>
        <input id="upload-input" type="file" accept=".puz,.json" @change="processFile">
    </div>
</template>

<script>
 import greenpaint from './components/greenpaint.vue';
 import convertToJson from './acrossLiteToJson.js';
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
             // TODO test for if it's a puz or json and do the correct action
             let puzzlepath = document.getElementById('puzzlepath').text.slice(1, -1);
             let response = await fetch(puzzlepath);
             if (!response.ok) {
                 throw new Error(`Error getting puzzle data: ${response.status}`);
             }
             let puzzleData;
             if (puzzlepath.slice(-3) === "puz") {
                 console.log("processing as puz");
                 let blob = await response.blob();
                 let arrayBuffer = await blob.arrayBuffer();
                 puzzleData = convertToJson(arrayBuffer);
             } else if (puzzlepath.slice(-4) === "json") {
                 console.log("processing as json");
                 puzzleData = await response.json();
             }
             return puzzleData;
         },

         processFile() {
             let input = document.getElementById('upload-input');
             if (!input.files[0]) {
                 console.error("No file selected");
                 return;
             } else if (input.files[0].name.slice(-3) === "puz") {
                 this.processPuz(input.files[0]);
             } else if (input.files[0].name.slice(-4) === "json") {
                 this.processJson(input.files[0]);
             } else {
                 return;
             }
         },

         processJson(file) {
             let fileReader = new FileReader();
             //let puzzleObj;
             let parent = this;
             fileReader.readAsText(file);
             fileReader.onload = function(e) {
                 parent.puzzleData = JSON.parse(e.target.result);
                 parent.uploadWait = false;
                 parent.loaded = true;
                 return;
             }
         },

         processPuz(file) {
             let fileReader = new FileReader();
             let parent = this;
             fileReader.readAsArrayBuffer(file);
             fileReader.onload = function(e) {
                 let json = convertToJson(e.target.result);
                 if (json) {
                     // in an if block cause if convert fails it returns null
                     parent.puzzleData = json;
                     parent.uploadWait = false;
                     parent.loaded = true;
                 }
                 return;
             }
         }
     },
      async created() {
          if (document.getElementById('puzzlepath')) {
              // if there's a tag with the puzzlepath
              this.puzzleData = await this.getPuzzleData();
              if (this.puzzleData) {
                  this.loading = false;
                  this.loaded = true;
              }
          } else {
              // open greenpaint in upload json mode. to enable this behavior,
              // don't add an element with id="puzzlepath" in the DOM
              this.loading = false;
              this.uploadWait = true;
          }
      }
  }
</script>
