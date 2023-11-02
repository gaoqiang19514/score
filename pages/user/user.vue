<template>
  <view class="page">
    <view class="container">
      <image class="avatar" :src="avatarUrl"></image>
    </view>
    <button type="primary" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
      授权头像
    </button>
  </view>
</template>

<script>
  const defaultAvatarUrl =
    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
  export default {
    data() {
      return {
        avatarUrl: defaultAvatarUrl,
      }
    },
    methods: {
      async onChooseAvatar(e) {
        const {
          avatarUrl
        } = e.detail

        if (!avatarUrl) {
          return;
        }

        wx.showLoading()

        try {
          const account = uniCloud.importObject('account')
          await account.setUserAvatar(avatarUrl)
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
    padding: 30rpx;
  }

  .container {
    display: flex;
    justify-content: center;
  }

  .avatar {
    margin-bottom: 30rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 10rpx;
  }
</style>