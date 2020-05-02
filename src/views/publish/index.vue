<template>
  <div class="publish-container">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
</el-breadcrumb>
  </div>
  <div class="text item">
<el-form :model="article" :rules="rules" ref="publish-form" label-width="100px">
  <el-form-item label="标题" prop="title">
    <el-input v-model="article.title"></el-input>
  </el-form-item>
  <el-form-item label="内容" prop="content" >
    <el-tiptap placeholder="请输入文章内容" height="300" v-model="article.content" :extensions="extensions"></el-tiptap>
  </el-form-item>
    <el-form-item label="封面" prop="cover">
    <el-radio-group v-model="article.cover.type">
      <el-radio :label="1">单图</el-radio>
      <el-radio :label="3">三图</el-radio>
      <el-radio :label="0">无图</el-radio>
      <el-radio :label="-1">自动</el-radio>
    </el-radio-group>
    <!--
      我们需要把选择的封面图片的地址放到
      article.cover.images 数组中

      当你给事件处理函数自定义参数以后, 就无法
      得到原本的那个数据参数

      如果想要在事件处理函数自定义传参以后还想得到原来的
      那个事件本身的函数,则手动指定$event 代表那个事件本身的参数

      在组件上使用v-model
    -->
    <template v-if="article.cover.type > 0">
      <upload-cover
        :key="cover"
        v-for="(cover, index) in article.cover.type"
        :cover-image="article.cover.images[index]"
        @update-cover="onUpdateCover(index, $event)"
      />
    </template>
  </el-form-item>
   <el-form-item label="频道" prop="channel_id">
    <el-select v-model="article.channel_id" placeholder="请选择">
      <el-option :label="item.name" v-for="(item, index) in channels" :key="index" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
      <!-- 按钮 默认有一个参数 如果不写 就会传上去 -->
    <el-button type="primary" @click="onPublish(false)">发表</el-button>
    <el-button @click="onPublish(true)">存入草稿</el-button>
  </el-form-item>
</el-form>
  </div>
</el-card>
</div>
</template>
<script>
import UploadCover from './components/upload-cover'
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/APi/article'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  FontType,
  Image,
  CodeBlock,
  TextColor,
  TextHighlight
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/APi/image'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
      channels: [], // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 0, // 封面类型 -1 自动 0 无图 1 1张 3 3张
          images: [] // 图片地址
        },
        channelss: '',
        chanel_id: null,
        chanel_name: null
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请填写文章内容', trigger: 'blur' }
        ]
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Image({
          // 默认把图片生成 base64
          // 字符串和内容存储在一起,如果需要自定义图片上传
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
          // 图片上传方法 返回一个 Promise<url>
        }),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline(),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new HorizontalRule(),
        new Fullscreen(),
        new Preview(),
        new FontType(),
        new CodeBlock(),
        new TextColor(),
        new TextHighlight()
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // 发布与修改用的同一组件 要判断
    // 路径有id 则展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return
        }
        const articleId = this.$route.query.id
        if (articleId) {
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        } else {
          addArticle(this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 修改文章: 加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>
<style scoped lang="less"></style>
