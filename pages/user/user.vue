<template>
  <div class="page">
    <div class="content">
      <div class="items">
        <div class="item border">
          <div>头像</div>
          <div>
            <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image class="avatar" :src="avatarUrl"></image>
            </button>
          </div>
        </div>
        <div class="item">
          <div>昵称</div>
          <input type="nickname" class="input" placeholder="请输入昵称" />
        </div>
      </div>
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
      onUserinfo(e) {},
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

  .avatar-wrapper {
    padding: 0;
    width: 56px !important;
    border-radius: 5rpx;
  }

  .avatar {
    display: block;
    width: 56px;
    height: 56px;
  }

  .input {
    text-align: right;
  }
</style>