<template>
  <div>
    <div id="menu">
      <button id="changeLayer" @click="changeLayer">切换</button>
      <button id="zoom-out" @click="zoomOut">缩小</button>
      <button id="zoom-in" @click="zoomIn">放大</button>
      <button  @click="panTo">定位</button>
      <button  @click="reset">复位</button>
      <button  @click="showMark">Mark</button>
      <!-- <button id="dragPan" @click="dragPan">弹框放大</button> -->
      <button id="drawPoint" @click="drawPoint">画点</button>
      <button id="drawLine" @click="drawLine">画线</button>
      <button id="drawPolygon" @click="drawPolygon">画面</button>
      <button id="modifyPolygon" @click="modifyPolygon">交互</button>
      <button id="addText" @click="addText">标注</button>
      <button id="cluster" @click="cluster">聚合</button>
      <button id="clearAll" @click="clearAll">清除</button>
      <!-- <el-button type="primary">测试</el-button> -->
    </div>
    <div style="display: none;">
      <div id="marker" title="Marker"></div>
      <!-- Popup -->
<!--     <div id="popup" class="ol-popup" style="display: none;" title="Welcome to OpenLayers"></div> -->   
     <div id="popup" class="ol-popup" style="display: none;">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
    </div>

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
  import ollayerTile from 'ol/layer/Tile'
  
  /* import VectorSource from 'ol/source/Vector';
  import olsourceOSM from 'ol/source/OSM'
  import Cluster from 'ol/source/Cluster'
  import XYZ from 'ol/source/XYZ' */
  import {Vector as VectorSource,OSM as OlsourceOSM,Cluster,XYZ} from 'ol/source'
  import {get as getProjection,toLonLat,fromLonLat} from 'ol/proj';

  /* import MousePosition from 'ol/control/MousePosition';
  import OverviewMap from 'ol/control/OverviewMap';
  import ScaleLine from 'ol/control/ScaleLine'; */

  import {MousePosition,OverviewMap,ScaleLine,ZoomSlider} from 'ol/control'

  import {createStringXY,toStringHDMS,format} from 'ol/coordinate';
  import Feature from 'ol/Feature'
  import {Point,LineString,Polygon} from 'ol/geom'
  import {Style,Text,Stroke,Fill,Circle} from 'ol/style'
  import {getArea, getLength} from 'ol/sphere';
  import {unByKey} from 'ol/Observable';

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
      mapZoom:5,
      isShiL:true,    // 区分当前底图是矢量还是影像  默认矢量

      sketch:null,
      listener:null,
      helpTooltipElement:null,
      helpTooltip:null,
      measureTooltipElement:null,
      measureTooltip:null,
      continuePolygonMsg: 'Click to continue drawing the polygon',
      continueLineMsg :'Click to continue drawing the line',

    }
  },
  methods:{

    formatLength(line) {

      var sourceProj = this.map.getView().getProjection();//获取投影坐标系
      var length = getLength(line,{projection: sourceProj});
      var output;
      if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
      } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
      }
      return output;
    },


  formatArea(polygon) {

    var sourceProj = this.map.getView().getProjection();//获取投影坐标系
    /* ol/sphere里有getLength()和getArea()可以用来测量距离和区域面积，默认的投影坐标系是EPSG:3857 */
    //var area = getArea(polygon);    
    var area = getArea(polygon,{projection: sourceProj});   // 使用当前的地图投影坐标系计算面积
    var output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
          ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
          ' ' + 'm<sup>2</sup>';
    }
    return output;
  },

  createHelpTooltip() {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'ol-tooltip hidden';
    var htte = this.helpTooltipElement;
    this.helpTooltip = new Overlay({
      element: htte,
      offset: [15, 0],
      positioning: 'center-left'
    });
    this.map.addOverlay(this.helpTooltip);
},

  createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';   //    
    var mtte = this.measureTooltipElement;
    this.measureTooltip = new Overlay({
      element: mtte,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
  },

  pointerMoveHandler(evt) {
    if (evt.dragging) {
      return;
    }
  
    var helpMsg = 'Click to start drawing';

    if (this.sketch) {
      var geom = this.sketch.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = this.continuePolygonMsg;
      } else if (geom instanceof LineString) {
        helpMsg = this.continueLineMsg;
      }
    }

    this.helpTooltipElement.innerHTML = helpMsg;
    this.helpTooltip.setPosition(evt.coordinate);
    this.helpTooltipElement.classList.remove('hidden');
},


/* 聚合测试 */

cluster(){

  var count = 10000;
  var features = new Array(count);
  var e = 12500000;  // 4500000  12500000
  for (var i = 0; i < count; ++i) {
    var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
    features[i] = new Feature(new Point(toLonLat(coordinates)));
  }

  var source = new VectorSource({
    features: features
  });

  var clusterSource = new Cluster({
    distance: 40,
    source: source
  });

  var styleCache = {};
  var clusters = new VectorLayer({
    source: clusterSource,
    style: function(feature) {
      var size = feature.get('features').length;
      var style = styleCache[size];
      if (!style) {
        style = new Style({
          image: new Circle({
            radius: 10,
            stroke: new Stroke({   // 边框颜色
              color: '#fff'
            }),
            fill: new Fill({
              color: '#DC143C'    // 设置成红色   3399CC
            })
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: '#fff'
            })
          })
        });
        styleCache[size] = style;
      }
      return style;
    }
});
this.map.addLayer(clusters);

},

/**
 *  
 */

    // 清除所有要素
    clearAll(){
        //this.drawLayer.getSource().clear();
      var layers = this.map.getLayers().getArray();
      for(var i=0;i<layers.length;i++){
        if(layers[i] instanceof VectorLayer){
         layers[i].getSource().clear();
        }
      }
       // this.map.getOverlays().clear();   // 此方法会将overlay对应的dom元素清除掉
        var overlays = this.map.getOverlays().getArray();
        for(var i=0;i<overlays.length;i++){
          overlays[i].setPosition(undefined);
        }
    },

    getTileLayer(){

      var layers = this.map.getLayers().getArray();
      var arr = [];
      for(var i=0;i<layers.length;i++){
        if(layers[i] instanceof ollayerTile){
           arr.push(layers[i]);
        }
      }
      return arr;
    },

    // 影像矢量切换
    changeLayer(){
      var layers = this.map.getLayers().getArray();
      var deleteLayers = [];
      for(var i=0;i<layers.length;i++){
        if(layers[i] instanceof ollayerTile){
          deleteLayers.push(layers[i]);
        }
        if(layers[i] instanceof VectorLayer){
         layers[i].getSource().clear();
        }
      }
      // 删除 tileLayer
      for(var i=0;i<deleteLayers.length;i++){
        if(deleteLayers[i] instanceof ollayerTile){
          this.map.removeLayer(deleteLayers[i]);
        }
      }
      // 清空overlay
        var overlays = this.map.getOverlays().getArray();
        for(var i=0;i<overlays.length;i++){
          overlays[i].setPosition(undefined);
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
     /*  this.selectAction.on('select', function(e) {
          var features = e.target.getFeatures().getArray();
          if(features.length > 0) {
          // console.log(features[0].values_);
          var obj = features[0].values_;
            alert(obj.name + "人口数量：" + obj.population );
          }
      }); */
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
              font: 'normal 18px 微软雅黑',    //文字样式
              text: feature.get('name'),      //文本内容
              fill: new Fill({       //文本填充样式（即文字颜色)
                  color: '#EE3B3B'
              })/* ,
              stroke: new Stroke({    // 边框颜色
                  color: '#F00', 
                  width: 2
              }) */
          })
      });
    },

    // 添加图文标注
    addText(){

         var iconFeature = new Feature({
            geometry: new Point([104.3966, 40.7232]),
            name: '内蒙某地',                         //名称属性
            population: 2115                       //人口数（万）
        });
        //设置点要素样式
        iconFeature.setStyle(this.createLabelStyle(iconFeature));

        //矢量标注的数据源
        var vectorSource = new VectorSource({
            features: [iconFeature]
        });
        //矢量标注图层
        var vectorLayer = new VectorLayer({
            source: vectorSource
        });
        /* vectorLayer.on('click',function(evt){
            alert('1');
        }); */
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

        var popElement = popup.getElement();
        var element = document.getElementById('popup-content');
        element.innerHTML = '<p>You clicked here:</p> 经纬度：'+ out;
        popElement.style.display='block';
       /*  element.html=true;
        element.placement = 'top';
        element.animation = false; */
        //console.info(xy);
        popup.setPosition(xy);

        var closer = document.getElementById('popup-closer');
        closer.onclick = function() {
          popup.setPosition(undefined);
          closer.blur();
          return false;
        };
        
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

    //unByKey(this.pointerMoveHandler);
    this.map.un('pointermove', this.pointerMoveHandler);
    this.map.on('pointermove', this.pointerMoveHandler);
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
            source:new OlsourceOSM()
          }) */
           this.getTdtLayer('vec_w')
          ,this.getTdtLayer("cva_w")
          //this.getTdtLayer(1),
          //this.getTdtLayer(2)
        ],
        view:new olView({
          center: this.center,
          projection: projection,
          zoom:this.mapZoom
        }),
      //  controls: ol.control.defaults().extend([mousePControl])
      });
      this.map.addControl(mousePControl); 
      /* this.map.addControl(new ZoomSlider());  */   // 缩放条控件
      this.map.addControl(new OverviewMap({    // 鹰眼
          view:new olView({projection: 'EPSG:4326'}),    
          layers: [this.getTdtLayer('vec_w'),this.getTdtLayer('cva_w')]  //    this.getTileLayer() 
          }
        ));
      this.map.addControl(new ScaleLine({
        units: 'metric' ,           // 比例尺默认的单位
        className: 'custom-scale-line',      //设置比例尺的样式
	      target: document.getElementById('scale-line') //显示比例尺的目标容器
      }));

     // this.map.on('pointermove', this.pointerMoveHandler);

      this.getLay()
      this.addInteraction()
      },
    
   getTdtLayer(lyr) {
      var urls=[];

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
    //var position = fromLonLat([116.3844, 39.9055]);
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
        style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#ffcc33'
              })
            })
        })
      })
      //把layer加入到地图中
      this.map.addLayer(this.drawLayer);

    },


    // 点、 线 、面绘制完成之后触发事件
    drawEnd(){
      this.draw.setActive(false);
      if(this.drawType=='Point'){
        return;
      }
     
      // 新加代码
      /* unByKey(this.pointerMoveHandler);
      this.helpTooltipElement.innerHTML = null; */
      this.map.un('pointermove', this.pointerMoveHandler);
      this.helpTooltipElement.innerHTML = null;
      return;
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      this.measureTooltip.setOffset([0, -7]);
      // unset sketch
      this.sketch = null;
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null;
      this.createMeasureTooltip();
      unByKey(this.listener);

    },

    //点、 线 、面开始绘制触发事件
    drawstart(evt){

      if(this.drawType=='Point'){
        return;
      }

      this.sketch = evt.feature;
      var tooltipCoord = evt.coordinate;

      var measureTooltipElement= this.measureTooltipElement;
      var measureTooltip=this.measureTooltip;
      var formatArea=this.formatArea;
      var formatLength = this.formatLength;
      this.listener = this.sketch.getGeometry().on('change', function(evt) {
        var geom = evt.target;
        var output;
        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });

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

    /* this.draw.on('drawend',function(e){
      thisDraw.setActive(false);
    });  */
    
    this.draw.on('drawend',this.drawEnd);
    this.draw.on('drawstart',this.drawstart);

    this.draw.setActive(false);   // 默认激活状态
    this.map.addInteraction(this.draw);

    // 创建 tip 容器
    this.createMeasureTooltip();
    this.createHelpTooltip();

    

    },
  },


  mounted(){
  this.getMap()

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >  /* scoped */
  .map{
    height: 500px;
  }
 
  .ol-popup {
        position: absolute;
        background-color: white;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
      }
      .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
      }
      .ol-popup-closer:after {
        content: "✖";
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

  #marker{
    width: 20px;
    height: 20px;
    border: 1px solid #088;
    border-radius: 10px;
    background-color: #0FF;
    opacity: 0.5;
    cursor:pointer;
  }
  
  .custom-mouse-position{
    color: red;
    font-size: 18px;
    font-family: "微软雅黑";
  }

  #menu{
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
    background: #668B8B;
    color:white;
    font-family:"微软雅黑";
    width: 80px;
}

.ol-tooltip{
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
    font-size: 12px;
  }
  .ol-tooltip-measure{
    opacity: 1;
    font-weight: bold;
  }
  .ol-tooltip-static{
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
  }
  .ol-tooltip-measure:before,
  .ol-tooltip-static:before{
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
  }
  .ol-tooltip-static:before{
    border-top-color: #ffcc33;
  }

</style>
