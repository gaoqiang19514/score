<template>
  <view class="page">
    <div class="container">
      <button class="button" type="primary" @click="onDecrement" :disabled="score <= MIN_SCORE">-</button>
      <div class="score">{{ score }}</div>
      <button class="button" type="primary" @click="onIncrement" :disabled="score >= MAX_SCORE">+</button>
    </div>
  </view>
</template>

<script>
  import {
    setOpenid
  } from '@/util.js'

  export default {
    data() {
      return {
        openid: '',
        db: null,
        MIN_SCORE: 0,
        MAX_SCORE: 100,
        score: 0
      }
    },
    async onLoad() {
      wx.showLoading()
      await this.login()
      await this.loadCollection();
      await this.loadRemoteScore()
      wx.hideLoading()
    },
    methods: {
      async login() {
        const {
          code
        } = await wx.login();

        if (!code) {
          new Error('wx.login获取code失败');
        }

        // 使用code换取openid
        try {
          const account = uniCloud.importObject('account')
          const res = await account.getOpenid(code)

          if (!res.openid) {
            wx.showModal({
              title: '提示',
              content: 'openid获取失败'
            })
            return;
          }

          // 保存openid
          setOpenid(res.openid)

          this.openid = res.openid;
        } catch (err) {
          console.log(err)
        }
      },
      loadCollection() {
        this.db = uniCloud.database().collection("score")
      },
      async loadRemoteScore() {
        const {
          openid,
          db,
        } = this;

        if (!openid) {
          wx.showModal({
            title: '提示',
            content: 'openid获取失败'
          })
          return;
        }

        const res = await db.where({
          openid
        }).get()

        if (res.result.data.length) {
          const data = res.result.data?.[0];
          if (data) {
            this.score = data.score;
          }
        } else {
          await db.add({
            openid,
            score: 0,
          })
        }
      },
      async updateScore(score) {
        const {
          openid,
          MIN_SCORE,
          MAX_SCORE
        } = this;

        if (score > MAX_SCORE) {
          wx.showToast({
            mask: true,
            icon: 'none',
            title: '不能大于100',
          })
          return
        }

        if (score < MIN_SCORE) {
          wx.showToast({
            mask: true,
            icon: 'none',
            title: '不能小于0',
          })
          return
        }

        try {
          await this.db.where({
            openid
          }).update({
            score: score,
          })
          this.score = score
        } catch (err) {
          console.error(err)
        }
      },
      onIncrement() {
        const {
          score
        } = this

        const nextScore = score + 1
        this.updateScore(nextScore)
      },
      onDecrement() {
        const {
          score
        } = this

        const nextScore = score - 1
        this.updateScore(nextScore)
      },
    }
  }
</script>

<style>
  .page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90vh;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .score {
    min-width: 50rpx;
    padding: 0 40rpx;
    text-align: center;
  }

  .button {
    min-width: 100rpx;
  }
</style>