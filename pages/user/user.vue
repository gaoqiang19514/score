<template>
  <div class="page">
    <div class="content">
      <div class="items">
        <div class="item border">
          <div>头像</div>
          <div>
            <button type="primary" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image class="avatar" :src="avatarUrl" />
            </button>
          </div>
        </div>
        <div class="item">
          <div>昵称</div>
          <div>
            <button open-type="getUserInfo" @getuserinfo="onUserinfo"> Click me </button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <button type="primary">
        退出登录
      </button>
    </div>
  </div>
</template>

<script>
  import {
    getOpenid
  } from '@/util.js'
  
  const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


  export default {
    data() {
      return {
        avatarUrl: defaultAvatarUrl,
      }
    },
    methods: {
      onUserinfo(e) {
      },
      async onChooseAvatar(e) {
        const {
          avatarUrl
        } = e.detail


        if (!avatarUrl) {
          return;
        }

        // 需要将头像上传到云存储中，得到新的地址再存储到数据库

        wx.showLoading()

        try {
          const openid = getOpenid();
          const account = uniCloud.importObject('account')
          await account.setUserAvatar(avatarUrl, openid)
          this.avatarUrl = avatarUrl
        } catch (err) {
          console.error(err)
        }

        wx.hideLoading()
      }
    }
  }
</script>

<style>
  .page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
  }

  .items {
    margin-bottom: 30rpx;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;

  }

  .border {
    border-bottom: 1px solid #ccc;
  }

  .bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 30rpx;
  }

  .avatar {
    margin-bottom: 30rpx;
    width: 50rpx;
    height: 50rpx;
    border-radius: 10rpx;
  }
</style>