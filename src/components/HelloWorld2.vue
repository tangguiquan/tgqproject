<template>
  <div>
    <div id="menu">
      <button id="changeLayer" @click="changeLayer">切换</button>
      <button id="zoom-out" @click="zoomOut">缩小</button>
      <button id="zoom-in" @click="zoomIn">放大</button>
      <button  @click="panTo">平移</button>
      <button  @click="reset">复位</button>
      <button  @click="showMark">Mark</button>
      <button id="drawPoint" @click="drawPoint">画点</button>
      <button id="drawLine" @click="drawLine">画线</button>
      <button id="drawPolygon" @click="drawPolygon">画面</button>
      <button id="modifyPolygon" @click="modifyPolygon">交互</button>
      <button id="addText" @click="addText">标注</button>
      <button id="clearAll" @click="clearAll">清除</button>
      <!-- <el-button type="primary">测试</el-button> -->
    </div>
   <div style="display: none;">
      <div id="marker" title="Marker"></div>
      <!-- Popup -->
    <div id="popup" class="ol-popup"> style="display: none;" title="Welcome to OpenLayers"></div>
    </div>
    
    <!-- 坐标显示位置 -->
    <div id="map" class="map">
      <div id="mouse-position"></div>  
       <div id="scale-line"></div>  
    </div>

  </div>

</template>

<script>
  import 'ol/ol.css'
  import olView from 'ol/View'
  import olMap from 'ol/Map'
  import Overlay from 'ol/Overlay';
  import olDraw from 'ol/interaction/Draw'
  import OlSelect from 'ol/interaction/Select'
  import OlModify from 'ol/interaction/Modify'
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import ollayerTile from 'ol/layer/Tile'
  import olsourceOSM from 'ol/source/OSM'
  import XYZ from 'ol/source/XYZ'
  import {get as getProjection,toLonLat,fromLonLat} from 'ol/proj';
  import MousePosition from 'ol/control/MousePosition';
  import OverviewMap from 'ol/control/OverviewMap';
  import ScaleLine from 'ol/control/ScaleLine';
  import {createStringXY,toStringHDMS,format} from 'ol/coordinate';
  import Feature from 'ol/Feature'
  import Point from 'ol/geom/Point'
  import {Style,Text,Stroke,Fill,Circle} from 'ol/style'

  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
export default {
  name: 'Map',
  data () {
    return {
      overlay:null,
      draw:null,
      drawType:'Point',     /* LineString、 Polygon */  
      drawLayer:null,
      selectAction:null,
      modifyAction:null,
      map:null,
      view:null,
      center:[106.34272, 35.6042484],
      mapZoom:4,
      isShiL:false    // 区分当前底图是矢量还是影像

    }
  },
  methods:{

    // 清除所有要素
    clearAll(){
        //this.drawLayer.getSource().clear();
      var layers = this.map.getLayers().getArray();
      for(var i=0;i<layers.length;i++){
        if(layers[i] instanceof VectorLayer){
         layers[i].getSource().clear();
        }
      }
        this.map.getOverlays().clear();
    },

    // 影像矢量切换
    changeLayer(){
      var layers = this.map.getLayers().getArray();
      var deleteLayers = [];
      for(var i=0;i<layers.length;i++){
        if(layers[i] instanceof ollayerTile){
          deleteLayers.push(layers[i]);
        }
      }
      for(var i=0;i<deleteLayers.length;i++){
        if(deleteLayers[i] instanceof ollayerTile){
          this.map.removeLayer(deleteLayers[i]);
        }
      }
      if(this.isShiL==false){
          this.map.addLayer(this.getTdtLayer('vec_w'));
          this.map.addLayer(this.getTdtLayer('cva_w'));
          this.isShiL = true;
      }else{
        this.map.addLayer(this.getTdtLayer(1));
        this.map.addLayer(this.getTdtLayer(2));
        this.isShiL = false;
      }


    },


    // 地图交互功能
    modifyPolygon(){

      // select 
      this.selectAction=new OlSelect();
      this.map.addInteraction(this.selectAction);
      // modify
      this.modifyAction = new OlModify({
          features: this.selectAction.getFeatures()
      });
      this.map.addInteraction(this.modifyAction);
      this.modifyAction.on("modifyend",function (e) {
          var features=e.features.array_;
        // var wktformat= new ol.format.WKT();
        // alert(wktformat.writeGeometry(features[0].getGeometry()));
      });
    },

    createLabelStyle(feature){
      //console.log(feature);
      return new Style({
          /* image: new Circle({
              fill: new Fill({
                color: 'rgba(255,255,255,1)'
              }),
              stroke: new Stroke({
                    color: '#3399CC',
                    width: 1.25
              }),
              radius: 5
            }), */
          text: new Text({
              textAlign: 'center',            //位置
              textBaseline: 'middle',         //基准线
              font: 'normal 16px 微软雅黑',    //文字样式
              text: feature.get('name'),      //文本内容
              fill: new Fill({       //文本填充样式（即文字颜色)
                  color: '#000'
              })/* ,
              stroke: new Stroke({
                  color: '#F00', 
                  width: 2
              }) */
          })
      });
    },

    // 添加图文标注
    addText(){

         var iconFeature = new Feature({
            geometry: new Point([116.28, 39.54]),
            name: '北京市',                         //名称属性
            population: 2115                       //人口数（万）
        });
        //设置点要素样式
        iconFeature.setStyle(this.createLabelStyle(iconFeature));
        iconFeature.on('drawend',function(e){
              alert('111');
        });  

        //矢量标注的数据源
        var vectorSource = new VectorSource({
            features: [iconFeature]
        });
        //矢量标注图层
        var vectorLayer = new VectorLayer({
            source: vectorSource
        });
        this.map.addLayer(vectorLayer);

    },

    showMark(){

      //var pos = fromLonLat([106.34272, 35.6042484]);
      var pos = [106.34272, 35.6042484];
      var marker = new Overlay({
        position: pos,
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false
      });
      this.map.addOverlay(marker);

      var popup = new Overlay({
        element: document.getElementById('popup')
        });
      this.map.addOverlay(popup);

      var mark = document.getElementById('marker');
      var thisMap = this.map;
      // mark 添加单击事件
      mark.addEventListener('click', function (e) {
       
        var xy=thisMap.getEventCoordinate(event);
        var template = '({x},{y})';
        var out = format(xy, template,4);

        var element = popup.getElement();
        element.innerHTML = '<p>You clicked here:</p> 经纬度：'+ out;
        element.style.display='block';
       /*  element.html=true;
        element.placement = 'top';
        element.animation = false; */
        
        //console.info(xy);
        popup.setPosition(xy);
        
      })

        


    },

   
   drawPoint(){
     /* this.draw.setActive(false);
     this.draw.set('type','Point');
     this.draw.setActive(true); */
     this.drawType = 'Point';
     if(this.draw!=null){
      this.map.removeInteraction(this.draw);
      this.addInteraction();
      this.draw.setActive(true);  
     }
   },
   drawLine(){

     this.drawType = 'LineString';
     if(this.draw!=null){
      this.map.removeInteraction(this.draw);
      this.addInteraction();
       this.draw.setActive(true);  
     }
   },
   drawPolygon(){

     this.drawType = 'Polygon';
     if(this.draw!=null){
      this.map.removeInteraction(this.draw);
      this.addInteraction();
       this.draw.setActive(true);  
     }

   },
   
    getMap(){
      var projection = getProjection('EPSG:4326');
      //var center = fromLonLat([101.34272, 23.6042484]);
      var mousePControl = new MousePosition({
        coordinateFormat: createStringXY(4), //坐标格式
        projection: 'EPSG:4326', //地图投影坐标系
        className: 'custom-mouse-position', //坐标信息显示样式
        // 显示鼠标位置信息的目标容器
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp' //未定义坐标的标记 空格表示
    });
      this.map = new olMap({
        target:'map',
        layers:[
          /* new ollayerTile({
            source:new olsourceOSM()
          }) */
          //this.getTdtLayer('vec_w')
          //,this.getTdtLayer("cva_w")
          this.getTdtLayer(1),this.getTdtLayer(2)
        ],
        view:new olView({
          center: this.center,
          projection: projection,
          zoom:this.mapZoom
        }),
      //  controls: ol.control.defaults().extend([mousePControl])
      });
      this.map.addControl(mousePControl);
      this.map.addControl(new OverviewMap({
          view:new olView({projection: 'EPSG:4326'}),    
          layers:[this.getTdtLayer(1),this.getTdtLayer(2)]
          }
        ));
      this.map.addControl(new ScaleLine({
        units: 'metric' ,           // 比例尺默认的单位
        className: 'custom-scale-line',      //设置比例尺的样式
	      target: document.getElementById('scale-line') //显示比例尺的目标容器

      }));

      this.getLay()
      this.addInteraction()
      },
    
   getTdtLayer(lyr) {
      var urls=[];
     /*  for(var i=0;i<8;i++)
      {
          urls.push( "https://t"+i+".tianditu.gov.cn/DataServer?T="+ lyr +"&x={x}&y={y}&l={z}&tk=9812570c3f4e8c70edc9b6c2af26fdf8")
          //https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9812570c3f4e8c70edc9b6c2af26fdf8
          // 影像图
          // https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img
          &STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}
          &tk=9812570c3f4e8c70edc9b6c2af26fdf8
          // https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=9812570c3f4e8c70edc9b6c2af26fdf8
      } */

      if(lyr==1){
        urls.push("https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=9812570c3f4e8c70edc9b6c2af26fdf8");

      }else if(lyr==2){
        urls.push("https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=9812570c3f4e8c70edc9b6c2af26fdf8");

      }else if(lyr=='vec_w'){
        urls.push( "https://t0.tianditu.gov.cn/DataServer?T="+ lyr +"&x={x}&y={y}&l={z}&tk=9812570c3f4e8c70edc9b6c2af26fdf8")
      }else{
        urls.push( "https://t0.tianditu.gov.cn/DataServer?T="+ lyr +"&x={x}&y={y}&l={z}&tk=9812570c3f4e8c70edc9b6c2af26fdf8")

      }
      var layer = new ollayerTile({
          source: new XYZ({
              urls:urls
          })
      });
      return layer;

   },
   
    //点击放大
    zoomIn(){
      let view=this.map.getView()
      let zoom =  view.getZoom()
      view.setZoom(zoom+1)
    },
    //点击缩小
    zoomOut(){
    //  获取/拿到ol.view对象的距离
    let view=this.map.getView()
    //  获取缩放等级
    let zoom =  view.getZoom()
      //设置缩放等级
      view.setZoom(zoom-1)
    },

    // 平移地图
    panTo(){

    var view = this.map.getView();
    //指定要平移到的位置的坐标
    var position = fromLonLat([116.3844, 39.9055]);
    //重设地图中心点，实现平移
    view.setCenter([116.3844, 39.9055]);
    view.setZoom(10);
    },
    // 复位地图
    reset(){
      this.map.getView().setCenter(this.center);
      //重置旋转角度为初始化角度
      //this.view.setRotation(rotation);
      //重置缩放等级为初始化缩放等级
      this.map.getView().setZoom(this.mapZoom);
    },

    getLay(){

      // 添加一个绘制的线使用的layer
      this.drawLayer = new VectorLayer({
        //layer所对应的source
        source: new VectorSource(),
      })
      //把layer加入到地图中
      this.map.addLayer(this.drawLayer);

    },


    // 点、 线 、面绘制完成之后触发事件
    drawEnd(){
    this.draw.setActive(false);
    },

    //地图上添加交互功能
    addInteraction() {

    this.draw = new olDraw({
      source: this.drawLayer.getSource(),
      type: this.drawType,
     /*  style: new Style({
        fill: new Fill({
            color: 'red'
         }),
      }) */
    });
    var thisDraw = this.draw;
    this.draw.on('drawend',function(e){
      thisDraw.setActive(false);
    });   // this.drawEnd
    this.draw.setActive(false);   // 默认激活状态
    this.map.addInteraction(this.draw);

    

    },
  },


  mounted(){
  this.getMap()

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .map{
    height: 500px;
  }
  .ol-popup{
    padding: 1px;
    background: aliceblue;
    border-radius: 5px;

  }
  .ol-popup-closer{
    text-decoration:none;
    position: absolute;
    top: 0;
    right: 5px;
    font-size: 12px;
    color: gray;
  }
  

  .popover-content {
    min-width: 150px;
  }

  /* 经纬度显示 */
  #mouse-position {
    float: left;
    position: fixed;
    /* background-color: crimson; */
    bottom: 5px;
    left: 550px;
    width: 200px;
    height: 20px;
    z-index: 2000;   /* 将z-index设置为显示在地图上层 */
  }

  #marker {
    width: 20px;
    height: 20px;
    border: 1px solid #088;
    border-radius: 10px;
    background-color: #0FF;
    opacity: 0.5;
    cursor:pointer;
  }
  
  .custom-mouse-position {
    color: red;
    font-size: 18px;
    font-family: "微软雅黑";
  }

  #menu {
    float: left;
    position: absolute;
    top: 100px;
    right: 10px;
    width: 50px;
    height: 200px;
    z-index: 2000;
  }

  #scale-line{
    width:100px;
    height:20px;
    float:left;
    position:absolute;
    bottom:100px;
    z-index:2000;
}
 .custom-scale-line{
    font-size:12px;
    background:black;
    color:white;
    font-family:"微软雅黑";
}
</style>
