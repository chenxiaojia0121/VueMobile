<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条" @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!-- 关注按钮 -->
          <follow-user :article-data="article" class="follow-btn"></follow-user>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow(article.aut_id)"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFollow(article.aut_id)"
          >关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
          <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
          <van-divider>正文结束</van-divider>
          <!-- 文章评论列表 -->
          <comment-list
          id="targetbox"
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
          />
          <!-- @reply-click="onReplyClick" -->
          <!-- /文章评论列表 -->
          <!-- 底部区域 -->
          <div class="article-bottom">
            <van-button
              class="comment-btn"
              type="default"
              round
              size="small"
              @click="isPostShow=true"
            >写评论</van-button>
            <van-icon
              name="comment-o"
              :badge="totalCommentCount"
              color="#777"
              @click="jump"
            />
            <!-- 收藏按钮 -->
            <!-- <van-icon
              color="#777"
              name="star-o"
            /> -->
            <collect-article
            v-model="article.is_collected"
            :article-id="article.art_id"
            ></collect-article>
            <!-- 点赞按钮 -->
            <!-- <van-icon
              color="#777"
              name="good-job-o"
            /> -->
            <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
            />
            <van-icon name="share" color="#777777"></van-icon>
          </div>
          <!-- /底部区域 -->
          <!-- 发布评论弹出 -->
          <van-popup
           v-model="isPostShow"
           position="bottom"
          >
          <comment-post
          :target="article.art_id"
          @post-success="onPostSuccess"
          ></comment-post>
          </van-popup>
          <!-- 回复评论 -->
      </div>

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="getArticle()">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复弹出框 -->
    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 100%;"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { getArticleById } from '@/API/article'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {}, // 当前点击回复的评论项
      target: 0
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getArticle()
  },
  mounted () {},
  methods: {
    async getArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdklasjdlkkjasdlkjasld')
        // }
        this.article = data.data
        // 初始化图片
        this.loading = false
        // setTimeout(() => {
        //   this.previewImage()
        // }, 0)
        this.$nextTick(function () {
          this.previewImage()
        })
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('获取文章失败', err)
      }
      this.loading = false
    },
    previewImage () {
      // 得到所有的image节点
      const articleContent = this.$refs['article-content']
      const img = articleContent.querySelectorAll('img')
      const images = []
      img.forEach((item, index) => {
        images.push(item.src)
        item.onclick = () => {
          ImagePreview({
            images: images,
            startPosition: index,
            closeable: true
          })
        }
      })
    },
    // 评论弹出层
    onPostSuccess (data) {
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
      this.totalCommentCount++
    },
    onReplyClick (comment) {
      this.currentComment = comment

      // 显示评论回复弹出层
      this.isReplyShow = true
    },
    async jump () {
      this.$nextTick(() => {
        document.querySelector('#targetbox').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  /deep/.van-icon-arrow-left::before {
    color: #fff
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }
    /deep/.van-button--info{
      color: rgb(255, 255, 255); background: rgb(0, 216, 206); border-color: rgb(0, 216, 206);
    }
    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/.van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}

</style>
