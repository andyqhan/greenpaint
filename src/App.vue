<greenpaint :puzzledata="puzzleData"/>

<script>
 import greenpaint from './components/greenpaint.vue'
 //import puzzle from '../public/static/circleex.json'
 export default {
     name: 'App',
     data() {
         return {
             puzzleData: {}
         }
     },
     components: {
         greenpaint
     },
     mounted() {
         this.$nextTick(() => {
             this.puzzleData = JSON.parse(document.getElementById('puzzledata').text);
         });
     }
 }
</script>
