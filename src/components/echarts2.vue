<template>
    <div class="main">
        <img class="mainimg" src="../assets/back.jpg" alt="">
        <div class="text">
            <p style="flex:2;color:#ffffff;font-size:15px;line-height: 3;">当前位置：XX</p>
            <p style="flex:8;color:#ffffff;font-size:40px;">JS设施综合管理平台</p>
            <p style="flex:2;color:#ffffff;font-size:15px;line-height: 3;">{{ nowDate + ' ' + nowTime + ' '}}</p>
        </div>
        <div class="content">
            <div class="contentone" style="flex:2.5">
                <div class="z1" style="flex:3">
                    <img class="mainimg" src="../assets/背景-左1.png" alt="">
                    <p class="wenben">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        规划计划</p>
                    <div id="zuo1" style="width:100%;height:100%" ref="zuo1"></div>
                </div>
                <div class="z2" style="flex:3">
                    <img class="mainimg" src="../assets/背景-左2.png" alt="">
                    <p class="wenben">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        工程建设</p>
                    <div id="zuo2" style="width:100%;height:100%" ref="zuo2"></div>
                </div>
                <div class="z3" style="flex:4">
                    <p class="wenben">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        土地管理</p>
                    <img class="mainimg" src="../assets/背景-左3.png" alt="">
                    <div id="zuo3" style="width:100%;height:100%" ref="zuo3"></div>
                </div>
            </div>
            <div style="flex:5" class="contenttwo">
                <div style="flex:7">
                    <!-- <img style="width:80%;height:100%" src="../assets/地球.png" alt=""> -->
                    <div id="map"></div>
                </div>
                <div style="display:flex;flex-direction:row;flex:3">
                    <div style="flex:1" class="z1">
                        <p class="wenben">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        环保绿化</p>
                        <img class="mainimg" src="../assets/背景-左下1.png" alt="">
                        <div id="zx1" style="width:100%;height:100%" ref="zx1"></div>
                    </div>
                    <div style="flex:1" class="z1">
                        <p class="wenben">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        国防工程</p>
                        <img class="mainimg" src="../assets/背景-右下1.png" alt="">
                        <div id="yx1" style="width:100%;height:100%" ref="yx1"></div>
                    </div>
                </div>
            </div>
            <div style="flex:2.5" class="contentthree">
                <div class="z1" style="flex:7">
                     <p class="wenben">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        住房保障</p>
                    <img class="mainimg" src="../assets/背景-右1.png" alt="">
                    <div style="margin-top:70px;margin-left:90px">
                    <p class="wenzi ">全J共计住房：<span style="color:blue;padding-left:10px">200000套</span></p>
                    <p class="wenzi">公寓房：<span style="color:green;padding-left:10px">180000套</span></p>
                    <p class="wenzi">安置住房：<span style="color:yellow;padding-left:10px">20000套</span></p>
                    <p class="wenzi">军以上住房： <span style="color:red;padding-left:10px">200000套</span></p>
                    <p class="wenzi">师一下住房：<span style="color:orange;padding-left:10px">180000套</span></p>
                    </div>
                    <div class="zf">
                        <div style="flex:1">
                            <p class="wenben2">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        公寓房</p>
                        <div id="gyf" style="width:100%;height:100%" ref="gyf"></div>
                        </div>
                        <div style="flex:1">
                            <p class="wenben2">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        安置住房</p>
                        <div id="azzf" style="width:100%;height:100%" ref="azzf"></div>
                        </div>
                    </div>
                </div>
                <div class="z3" style="flex:3;margin-left:10px;">
                     <p class="wenben">
                        <span style="width:5px;height:15px;display:inline-flex;background: aqua;"></span>
                        设施设备</p>
                    <img class="mainimg" src="../assets/背景-右2.png" alt="">
                        <div id="you1" style="width:100%;height:100%" ref="you1"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import ol from "../../static/ol.js";
export default {
  data() {
    return {
      nowDate: "", // 当前日期
      nowTime: "", // 当前时间
      nowWeek: "", // 当前星期
      map: null,
      onTool: "none",
      map: {},
      draw: {},
      toolLayer: {}
    };
  },
  created() {},
  methods: {
    initToolLayer() {
      console.log(this.toolLayer);
      // 将图形的数据层包上一层图层放入地图
      // 点层样式
      this.toolLayer.Point = new ol.layer.Vector({
        source: new ol.source.Vector({ wrapX: false }),
        zIndex: 9,
        style: new ol.style.Style({
          // 设置线颜色\宽度
          image: new ol.style.Icon({
            // anchor: markSettings.markAnchor, //点图片偏移量
            src: "static/img/marker.png" // 图片路径
          })
        })
      });
      // 线层 样式
      this.toolLayer.LineString = new ol.layer.Vector({
        source: new ol.source.Vector({ wrapX: false }),
        zIndex: 9,
        style: new ol.style.Style({
          // 设置线颜色\宽度
          stroke: new ol.style.Stroke({
            width: 4,
            color: "#119aff"
          })
        })
      });

      // 图形层 样式
      this.toolLayer.Polygon = new ol.layer.Vector({
        source: new ol.source.Vector({ wrapX: false }),
        zIndex: 9,
        style: new ol.style.Style({
          // 设置线颜色\宽度
          stroke: new ol.style.Stroke({
            width: 4,
            color: "#119aff"
          }),
          // 图形区域内颜色
          fill: new ol.style.Fill({
            color: "rgba(57,160,255,0.5)"
          })
        })
      });
      // 点线面图层放入地图盒子
      for (let k in this.toolLayer) {
        this.map.addLayer(this.toolLayer[k]);
      }
    },
    initMap() {
      let self = this;
      let center = [119.17, 31.95];
      let mapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          // 本人项目中的地图服务为内网 这里替换官网的地图
          url: `https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=0e6fc415256d4fbb9b5166a718591d71`
        })
        // 数据源坐标系
        // projection: 'EPSG:3858',
      });
      // 初始化地图样式
      this.map = new ol.Map({
        target: document.getElementById("map"),
        // 数据源数组
        // layers: [mapLayer],
        layers: [
          new ol.layer.Tile({
            title: "天地图路网",
            source: new ol.source.XYZ({
              url:
                "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d0cf74b31931aab68af181d23fa23d8d"
            })
          }),
          new ol.layer.Tile({
            title: "天地图文字标注",
            source: new ol.source.XYZ({
              url:
                "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d0cf74b31931aab68af181d23fa23d8d"
            })
          })
        ],
        view: new ol.View({
          // projection: projection.getCode(), // EPSG:4326
          // 地图盒子坐标系
          // 依稀记得低版本是不支持4326的 这里用的是5.2 是支持的
          // 本人项目中数据源坐标是3858 但给我的坐标数据是4326的 于是设置地图盒子的坐标系为4326
          projection: "EPSG:4326",
          center: center,
          zoom: 12
        }),
        // 地图交互 https://openlayers.org/en/latest/apidoc/module-ol_interaction.html
        interactions: ol.interaction.defaults({
          // 关闭双击缩放地图 默认true
          doubleClickZoom: false,
          // 是否能拖动 默认true,那我为啥写?玩!
          dragPan: true
        })
      });
      self.map.on("click", function(e) {
        console.log(e);
      });
    },
    //左1
    zuo1() {
      const zuo1 = this.$echarts.init(this.$refs.zuo1);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {},
        grid: {
          left: "15%",
          right: "15%",
          bottom: "5%",
          top: "30%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            //设置坐标轴字体颜色和宽度
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            //设置坐标轴字体颜色和宽度
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            type: "bar",
            stack: "广告",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            type: "bar",
            stack: "广告",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            type: "bar",
            stack: "广告",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            type: "bar",
            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
            markLine: {
              lineStyle: {
                type: "dashed"
              },
              data: [[{ type: "min" }, { type: "max" }]]
            }
          },
          {
            type: "bar",
            barWidth: 5,
            stack: "搜索引擎",
            data: [620, 732, 701, 734, 1090, 1130, 1120]
          },
          {
            type: "bar",
            stack: "搜索引擎",
            data: [120, 132, 101, 134, 290, 230, 220]
          },
          {
            type: "bar",
            stack: "搜索引擎",
            data: [60, 72, 71, 74, 190, 130, 110]
          },
          {
            type: "bar",
            stack: "搜索引擎",
            data: [62, 82, 91, 84, 109, 110, 120]
          }
        ]
      };
      zuo1.setOption(option);
      console.log(zuo1);
    },
    zuo2() {
      const zuo2 = this.$echarts.init(this.$refs.zuo2);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          top: "bottom",
          data: []
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["55%", "60%"],
            data: [
              { value: 10, name: "rose1" },
              { value: 5, name: "rose2" },
              { value: 15, name: "rose3" },
              { value: 25, name: "rose4" },
              { value: 20, name: "rose5" },
              { value: 35, name: "rose6" },
              { value: 30, name: "rose7" },
              { value: 40, name: "rose8" }
            ]
          }
        ]
      };
      zuo2.setOption(option);
    },
    zuo3() {
      const zuo3 = this.$echarts.init(this.$refs.zuo3);
      let option = {
        dataset: {
          source: [
            ["score", "amount", "product"],
            [89.3, 58212, "111"],
            [57.1, 78254, "222"],
            [74.4, 41032, "333"],
            [50.1, 12755, "444"],
            [89.7, 20145, "555"],
            [68.1, 79146, "666"]
          ]
        },
        grid: { containLabel: true },
        xAxis: {
          name: "amount",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        visualMap: {
          orient: "horizontal",
          left: "center",
          min: 10,
          max: 100,
          inRange: {
            color: ["#396cff", "#E15457"]
          }
        },
        series: [
          {
            type: "bar",
            encode: {
              // Map the "amount" column to X axis.
              //  x: "amount",
              // Map the "product" column to Y axis
              y: "product"
            }
          }
        ]
      };
      zuo3.setOption(option);
    },
    zx1() {
      const zx1 = this.$echarts.init(this.$refs.zx1);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      zx1.setOption(option);
    },
    yx1() {
      const yx1 = this.$echarts.init(this.$refs.yx1);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: []
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            label: {
              position: "inner"
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: "直达", selected: true },
              { value: 679, name: "营销广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          },
          {
            name: "访问来源",
            type: "pie",
            radius: ["40%", "55%"],
            label: {
              backgroundColor: "#eee",
              borderColor: "#aaa",
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: "#999",
                  lineHeight: 22,
                  align: "center"
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: "#aaa",
                  width: "100%",
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: "#eee",
                  backgroundColor: "#334455",
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            data: [
              { value: 335, name: "直达" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1048, name: "百度" },
              { value: 251, name: "谷歌" },
              { value: 147, name: "必应" },
              { value: 102, name: "其他" }
            ]
          }
        ]
      };
      yx1.setOption(option);
    },
    gyf() {
      const gyf = this.$echarts.init(this.$refs.gyf);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          top: "bottom",
          data: []
        },
        series: [
          {
            name: "半径模式",
            type: "pie",
            radius: [20, 110],
            center:["50%","50%"],
            roseType: "radius",
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: []
          },
          {
            name: "面积模式",
            type: "pie",
            radius: [10, 60],
            roseType: "area",
            data: [
              { value: 10, name: "rose1" },
              { value: 5, name: "rose2" },
              { value: 15, name: "rose3" },
              { value: 25, name: "rose4" },
              { value: 20, name: "rose5" },
              { value: 35, name: "rose6" },
              { value: 30, name: "rose7" },
              { value: 40, name: "rose8" }
            ]
          }
        ]
      };
      gyf.setOption(option);
    },
    azzf() {
      const azzf = this.$echarts.init(this.$refs.azzf);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          top: "bottom",
          data: []
        },
        series: [
          {
            name: "半径模式",
            type: "pie",
            radius: [20, 110],
            roseType: "radius",
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: []
          },
          {
            name: "面积模式",
            type: "pie",
            radius: [10, 60],
            data: [
              { value: 10, name: "rose1" },
              { value: 5, name: "rose2" },
              { value: 15, name: "rose3" },
              { value: 25, name: "rose4" },
              { value: 20, name: "rose5" },
              { value: 35, name: "rose6" },
              { value: 30, name: "rose7" },
              { value: 40, name: "rose8" }
            ]
          }
        ]
      };
      azzf.setOption(option);
    },
    you1() {
      const you1 = this.$echarts.init(this.$refs.you1);
      var colors = ["#5793f3", "#d14a61", "#675bba"];
      let option = {
        color: colors,

        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross"
          }
        },
        legend: {
          data: []
        },
        // grid: {
        //   top: 70,
        //   bottom: 50
        // },
        grid: {
          left: "15%",
          right: "15%",
          bottom: "15%",
          top: "30%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1]
              }
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    "降水量  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                }
              }
            },
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            data: []
          },
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0]
              }
            },
            axisPointer: {
              label: {
                formatter: function(params) {
                  return (
                    "降水量  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                }
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "2015 降水量",
            type: "line",
            xAxisIndex: 1,
            smooth: true,
            data: [
              10.6,
              10.9,
              9.0,
              65.4,
              28.7,
              70.7,
              105.6,
              82.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: "2016 降水量",
            type: "line",
            smooth: true,
            data: [
              3.9,
              5.9,
              11.1,
              18.7,
              48.3,
              69.2,
              71.6,
              46.6,
              55.4,
              18.4,
              10.3,
              0.7
            ]
          }
        ]
      };

      you1.setOption(option);
    },
    currentTime() {
      setInterval(this.getDate, 500);
    },
    getDate: function() {
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let week = new Date().getDay();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      if (week == 1) {
        this.nowWeek = "星期一";
      } else if (week == 2) {
        this.nowWeek = "星期二";
      } else if (week == 3) {
        this.nowWeek = "星期三";
      } else if (week == 4) {
        this.nowWeek = "星期四";
      } else if (week == 5) {
        this.nowWeek = "星期五";
      } else if (week == 6) {
        this.nowWeek = "星期六";
      } else {
        this.nowWeek = "星期日";
      }
      _this.nowTime = hh + ":" + mf;
      _this.nowDate = yy + "-" + mm + "-" + dd;
    }
  },
  mounted() {
    this.currentTime();
    this.zuo1();
    this.zuo2();
    this.zuo3();
    this.zx1();
    this.yx1();
    this.gyf();
    this.azzf();
    this.you1();
    this.initMap();
    this.initToolLayer();
  },
  beforeDestroy: function() {
    if (this.getDate) {
      clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
    }
  }
};
</script>

<style scoped>
.main {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.mainimg {
  position: absolute;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
.text {
  display: flex;
  flex: 0.8;
}
.content {
  flex: 9.2;
  display: flex;
  margin-bottom: 50px;
  margin-left: 30px;
  margin-right: 30px;
}
.contentone {
  display: flex;
  flex-direction: column;
}
.contenttwo {
  display: flex;
  flex-direction: column;
}
.contentthree {
  display: flex;
  flex-direction: column;
}
.z1 {
  position: relative;
}
.z2 {
  position: relative;
  margin-left: 10px;
}
.z3 {
  position: relative;
}
.wenben {
  position: absolute;
  left: 50px;
  top: 30px;
  color: aqua;
  font-size: 20px;
}
.wenben2 {
  margin-left: 40px;
  color: aqua;
  font-size: 20px;
}
.wenzi {
  color: #ffffff;
  font-size: 20px;
  padding-bottom: 13px;
}
.zf {
  width: 100%;
  height: 50%;
  display: flex;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
