<template>
  <div class="comment-container">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>评论管理</el-breadcrumb-item>
</el-breadcrumb>
  </div>
  <!--1. 把数据列表绑定给表格的 data
      2. 设计表格列
      3. 给表格绑定要渲染的数据字段
  -->
  <el-table
      class="table-list"
      :data="articles"
      stripe
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
      <el-table-column
        prop="comment_status"
        label="评论状态">
        <!-- 自定义表格列 -->
        <template slot-scope="scope">
        {{ scope.row.comment_status ? '正常' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <!-- 自定义表格列 -->
        <template slot-scope="scope">
        <el-switch
        @change="onStatusChange(scope.row)"
        v-model="scope.row.comment_status"
        active-color="#13ce66"
        :disabled="scope.row.statusDisabled"
        inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页
    使用步骤:
            绑定页码
            绑定每页大小
            current-page 控制激活的页码 初始1
            page-sizes 控制可选的每页大小
            page-size 控制一页多大
    -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      background
></el-pagination>
</el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/APi/article'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章数据列表
      totalCount: 0, // 总数据 条数
      pageSize: 10,
      page: 1 // 当前激活的页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // 页码改变加载指定页码数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      // 让分页组件激活的页码和请求数据的页码保持一致
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true
      // 请求提交修改
      updateCommentStatus(article.id.toString(), article
        .comment_status).then(res => {
        // 刷新页面
        // 启用开关
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启成功' : '关闭成功'
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.table-list {
  margin-bottom: 30px;
}
</style>
