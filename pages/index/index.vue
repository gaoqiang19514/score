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
				MIN_SCORE: 0,
				MAX_SCORE: 100,
				score: 1,
			}
		},
		onLoad() {

		},
		methods: {
			async updateScore(score) {
				const {
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

				const updateScoreObj = uniCloud.importObject('updateScore') // 导入云对象
				
				await updateScoreObj.main(score)

				this.score = score
				wx.setStorageSync('score', score)
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