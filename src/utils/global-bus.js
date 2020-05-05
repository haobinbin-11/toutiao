// 全局通信总线
// 呼叫中心
// 作用: 可以让任何组件之间相互通信
import Vue from 'vue'
export default new Vue()
// 假设 a 组件 要给 b 组件 发送数据
// b 注册通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('自定义事件名称', (data) => {
// 处理函数
// })

// a 发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('自定义事件名称',123)

// 注意 通信两端使用的事件名称必须
