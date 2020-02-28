<template>
    <div class="custom-tree-container">
  <div class="block">
<el-tree
  :data="data"
  show-checkbox
  node-key="id"  
  :props="defaultProps"
  check-strictly
  @check-change="dd" 
  default-expand-all
  @node-click="aa"
  @check="aaa"
  ref="treeForm"> 
  <span class="slot-t-node" slot-scope="{ node, data }">
        <i :class="{ 'fa fa-folder': !node.expanded, 'fa fa-folder-open':node.expanded}" style="color: #fcd568;" />
        <span>{{ node.label }}</span>
    </span>
</el-tree>
  </div>
  <div class="block">
<el-tree
  :data="data2"
  show-checkbox
  default-expand-all
  node-key="id"  
  :props="defaultProps"
  check-strictly
  @check-change="ee" 
  @check="eee"
  @node-click="bb"
  ref="treeForm2">      
  <span class="slot-t-node" slot-scope="{ node, data }">
        <i :class="{ 'fa fa-folder': !node.expanded, 'fa fa-folder-open':node.expanded}" style="color: #fcd568;" />
        <span>{{ node.label }}</span>
    </span>     
</el-tree>
  </div>
  <el-button @click="queding">确定</el-button>
  <el-button @click="xiugai">修改</el-button>


  <div style="width:800px;height:500px;margin-top:380px">
      <div class="block">
<el-tree
  :data="dataa"
  show-checkbox
  node-key="id"  
  :props="defaultProps"
  check-strictly
  @check-change="qwe" 
  default-expand-all
  @node-click="asd"
  @check="zxc"
  ref="treeFormqq"> 
  <span class="slot-t-node" slot-scope="{ node, data }">
        <i :class="{ 'fa fa-folder': !node.expanded, 'fa fa-folder-open':node.expanded}" style="color: #fcd568;" />
        <span>{{ node.label }}</span>
    </span>
</el-tree>
  </div>
  <div class="block">
<el-tree
  :data="dataa2"
  show-checkbox
  default-expand-all
  node-key="id"  
  :props="defaultProps"
  check-strictly
  @check-change="qwe2" 
  @check="asd2"
  @node-click="zxc2"
  ref="treeFormqq2">      
  <span class="slot-t-node" slot-scope="{ node, data }">
        <i :class="{ 'fa fa-folder': !node.expanded, 'fa fa-folder-open':node.expanded}" style="color: #fcd568;" />
        <span>{{ node.label }}</span>
    </span>     
</el-tree>
  </div>
  </div>
</div>
</template>

<script>
let id = 1000;
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          label: "品牌一",
          children: [
            {
              id: 4,
              label: "华东区域",
              children: [
                {
                  id: 9,
                  label: "上海"
                },
                {
                  id: 10,
                  label: "昆山"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "品牌二",
          children: [
            {
              id: 5,
              label: "华东区域"
            },
            {
              id: 6,
              label: "华南区域"
            }
          ]
        },
        {
          id: 3,
          label: "品牌三",
          children: [
            {
              id: 7,
              label: "华北区域"
            },
            {
              id: 8,
              label: "华南区域"
            }
          ]
        }
      ],
      data2: [
        {
          id: 11,
          label: "品牌一2",
          children: [
            {
              id: 44,
              label: "华东区域2",
              children: [
                {
                  id: 99,
                  label: "上海2"
                },
                {
                  id: 100,
                  label: "昆山2"
                }
              ]
            }
          ]
        },
        {
          id: 22,
          label: "品牌二2",
          children: [
            {
              id: 55,
              label: "华东区域2"
            },
            {
              id: 66,
              label: "华南区域2"
            }
          ]
        },
        {
          id: 33,
          label: "品牌三2",
          children: [
            {
              id: 77,
              label: "华北区域2"
            },
            {
              id: 88,
              label: "华南区域2"
            }
          ]
        }
      ],
      dataa: [
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      dataa2: [
        {
          id: 22,
          label: "一级 22",
          children: [
            {
              id: 55,
              label: "二级 2-11"
            },
            {
              id: 66,
              label: "二级 2-22"
            }
          ]
        },
        {
          id: 33,
          label: "一级 33",
          children: [
            {
              id: 77,
              label: "二级 3-11"
            },
            {
              id: 88,
              label: "二级 3-22"
            }
          ]
        }
      ],
      selectOrg: {
        orgsid: []
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      i: 0,
      leftdata: {},
      leftdatalable: "",
      a: "",
      checkedId: null,
      rightdata: {},
      mmm: {},
      nnn: {}
    };
  },
  watch: {},
  methods: {
    // 功能待定
    queding() {},
    // 更改选择功能
    xiugai() {
      this.leftdata.label = this.a;
      if (this.leftdata.label.indexOf("→") != -1) {
        let a = this.leftdata.label.split("→")[0];
        this.leftdata.label = a;
      }
    },
    aa(data, checked, node) {
      this.checkedId = data.id;
      this.$refs.treeForm.setCheckedNodes([data]);
    },
    bb(data, checked, node) {
      this.checkedId = data.id;
      this.$refs.treeForm2.setCheckedNodes([data]);
      let chkIds1 = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys());
      console.log(chkIds1);
    },
    dd(data, checked, node) {
      if (checked) {
        this.checkedId = data.id;
        this.$refs.treeForm.setCheckedNodes([data]);
        this.leftdata = data;
        this.leftdatalable = data.label;
        this.a = data.label;
        this.$refs.treeForm2.setCheckedKeys([]);
      }
    },
    ee(data, checked, node) {
      if (checked) {
        //        this.leftdata.label = this.leftdatalable;
        this.checkedId = data.id;
        this.$refs.treeForm2.setCheckedNodes([data]);
        //      this.leftdata.label = this.leftdata.label + "→" + data.label;
      }
    },
    aaa(a, b, c, d) {
      if (b.checkedNodes.length !== 0) {
        this.leftdata = b.checkedNodes[0];
      } else {
        this.leftdata = {};
      }
    },
    eee(a, b, c, d) {
      if (b.checkedNodes.length !== 0) {
        console.log(b.checkedNodes[0].label);
        this.leftdata.label = this.leftdatalable;
        this.leftdata.label =
          this.leftdata.label + "→" + b.checkedNodes[0].label;
      } else {
        this.leftdata.label = this.leftdatalable;
      }
    },
    qwe(data, checked, node) {
      if (checked) {
        this.checkedId = data.id;
        this.$refs.treeFormqq.setCheckedNodes([data]);
      }
    },
    asd(data, checked, node) {},
    zxc(data, checked, node) {
      if (checked.checkedNodes.length !== 0) {
        let obj = checked.checkedNodes[0];
        this.mmm = obj;
      }
    },
    qwe2(data, checked, node) {
      if (checked) {
        this.checkedId = data.id;
        this.$refs.treeFormqq2.setCheckedNodes([data]);
      }
    },
    asd2(data, checked, node) {
      if (checked.checkedNodes.length !== 0) {
        let obj2 = checked.checkedNodes[0];
        this.nnn = obj2;
        console.log(this.mmm, this.nnn);
        if (this.mmm.children) {
          if (!this.nnn.children) {
            alert("选择的节点不对");
            this.$refs.treeFormqq2.setCheckedKeys([]);
          }
        } else {
          if (this.nnn.children) {
            alert("选择的节点不对");
            this.$refs.treeFormqq2.setCheckedKeys([]);
          }
        }
      }
    },
    zxc2(data, checked, node) {}
  }
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.block {
  width: 300px;
  float: left;
  margin-right: 50px;
}
</style>
