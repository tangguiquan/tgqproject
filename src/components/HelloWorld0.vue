<template>
  <!-- <div class="hello">
    <h1>{{ msg }}</h1> 
   
  </div> -->
   <div id="map" class="map"></div>
</template>

<script>
import Map from 'ol/Map';
import View from "ol/View";
/* 添加图层 */
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import TileWMS from "ol/source/TileWMS.js";
import OSM from 'ol/source/OSM';
/* 格式化地理坐标 */
import { fromLonLat } from "ol/proj.js";

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      map:  null   // 
    }
  },
   mounted(){
    this.init();
  },
  methods:{


    
    

  },
}
</script>

<style scoped>
#map{
  width: 100%;
  height: 500px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
