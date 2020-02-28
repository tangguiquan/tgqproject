import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import demo from '@/components/demo'
import echarts2 from '@/components/echarts2'

Vue.use(Router)

export default new Router({
  routes: [
    /* {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    } */
    {
      path: '/',
      name: 'echarts2',
      component: echarts2
    }
   /*  {
      path: '/',
      name: 'demo',
      component: demo
    } */
  ]
})
