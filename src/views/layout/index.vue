<template>
  <!-- <div class="home-container"> -->
  <el-container class="layout-container">
  <el-aside class="aside" width="auto" ><app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside></el-aside>
  <el-container>
    <el-header class="header">
        <div>
        <i :class="{ 'el-icon-s-fold' : isCollapse, 'el-icon-s-unfold' : !isCollapse}" @click="isCollapse = !isCollapse"></i>
        <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
      <div class="avatar-wrap">
        <img class="avatar" :src="user.photo" alt="">
        <span>{{ user.name }}</span>
        <i class="el-icon-arrow-down"></i>
      </div>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item class="el-icon-setting">设置</el-dropdown-item>
    <!-- 组件默认是不识别原生事件的, 除非内部做了处理 -->
    <!-- .native 用这个修饰符 -->
    <el-dropdown-item @click.native="onLogout" class="el-icon-unlock">退出</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>

        </el-header>
    <el-main class="main"><router-view></router-view></el-main>
  </el-container>
</el-container>
  <!-- <div>顶部导航栏</div>

  子路由出口
  <router-view></router-view>
  <div>侧边导航栏</div>
  </div> -->
</template>
<script>
import AppAside from './componets/aside'
import { getUserProfile } from '@/APi/user'
import globalBus from '@/utils/global-bus'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边栏展示状态
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.loadUserProfile()
    // 注册自定义事件
    // 只有当这个事件发布以后,这个注册函数就会被调用到
    globalBus.$on('update-user', (data) => {
      console.log('update-user', data)
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted () {
  },
  methods: {
    // 除了登录接口, 其他接口都需要授权才能请求使用
    // 或者说,除了登录接口, 其他接口都需要省份令牌才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('是否要退出?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '退出成功!'
        // })
        // 把用户的登录状态清楚
        window.localStorage.removeItem('user')
        // 跳转页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: #d3dce6;
  .aside-menu {
      height: 100%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.main {
  background-color: #e9eef3;
}
.avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 5px;
    }
}
</style>>
