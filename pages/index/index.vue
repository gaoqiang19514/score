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
	export default {
		data() {
			return {
				openid: '',
				scoreCollection: null,
				MIN_SCORE: 0,
				MAX_SCORE: 100,
				score: 0,
			}
		},
		async onLoad() {
			wx.showLoading()
			await this.login()
			await this.init()
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
				
				const { result } = await uniCloud.callFunction({
					name: 'updateScore',
					data: {
						code
					}
				})
				
				const data = JSON.parse(result)

				if (!data.openid) {
					wx.showModal({
						title: '提示',
						content: 'openid获取失败'
					})
					return;
				}

				this.openid = data.openid;
			},
			async init() {
				const {
					openid
				} = this;

				if (!openid) {
					wx.showModal({
						title: '提示',
						content: 'openid获取失败'
					})
					return;
				}

				const scoreCollection = uniCloud.database().collection("score")

				const res = await scoreCollection.where({
					openid
				}).get()

				if (res.result.data.length) {
					const data = res.result.data?.[0];
					if (data) {
						this.score = data.score;
						this.scoreCollection = scoreCollection
					}
				} else {
					await scoreCollection.add({
						openid,
						score: 0,
					})
					this.scoreCollection = 0
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

				await this.scoreCollection.where({
					openid
				}).update({
					score: score,
				})

				this.score = score
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