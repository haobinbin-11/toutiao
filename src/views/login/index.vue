<template>
<!-- el-from表单组件
  每个表单都必须使用 el-from-item 组件包裹
  -->
  <div class="login-container">
    <el-form ref="login-from" class="login-style" :model="user" :rules="fromRules">
      <div class="login-header"></div>
  <el-form-item prop="mobile"  class="top">
    <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
  </el-form-item>
  <el-form-item prop="code">
  <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
  </el-form-item>
  <el-form-item prop="agree">
    <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
  </el-form-item>
  <el-form-item>
    <el-button class="login-btn"  type="primary" @click="onLoginin" :loading="loding">登录</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
import { login } from '@/APi/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13977777777',
        code: '246810',
        agree: false // 是否同意协议的选中
      },
      loding: false, // 登录的loading状态
      fromRules: {
        mobile: [
          // 要验证的数据名称
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确手机号格式', trigger: 'blur' }
        ],
        code: [
          // 要验证的数据名称
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确验证码格式', trigger: 'blur' }
        ],
        agree: [
          // 自定义校验规则
          // 验证通过: callback()
          // 验证失败: callback(new Error('错误消息))
          // false: 验证失败
          {
          // validator 验证函数不是你来调用的, 而是当 element 表单触发验证的时候它会自己内部调用
          // 所以你只需要提供校验函数的处理逻辑就可以
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLoginin () {
      // 获取表单数据(根据接口要求绑定数据)
      // const user = this.user
      // 表单验证
      this.$refs['login-from'].validate(vaild => {
        // 如果表单验证失败, 停止请求提交
        if (!vaild) {
          return
        }
        // 验证通过, 请求登录
        this.login()
      })
      // 处理后端响应结果
      // 成功:XXX
      // 失败:XXX
    },
    login () {
      // 开启登陆中loading
      this.loding = true

      // 对于代码中的请求操作
      // 1. 接口请求可能需要重用
      // 2. 实际工作中, 接口非常容易变动, 改起来麻烦
      // 我们建议的做法是吧所有的请求都封装成函数然后统一的组织到模块中进行管理
      // 这样好处 :管理维护方便 也好重用
      login(this.user).then(res => {
        // 登录成功
        console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭loading
        this.loding = false

        // 将接口返回的用户相关数据存储到本地存储, 方便应用数据共享
        // 本地存储只能存储字符串
        // 如果想存储对象 数组 把他们转为json 格式字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        // 登录失败
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误')
        // 关闭loading
        this.loding = false
      })
    }

  }
}
</script>

<style lang="less" scoped>
.login-container{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
}
.login-style{
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
}
.login-btn{
  width: 100%;
}
.login-header{
  height: 57px;
  width: 300px;
  background: url("./logo_index.png") no-repeat;
}
.top{
  margin-top: 20px;
}
</style>>
