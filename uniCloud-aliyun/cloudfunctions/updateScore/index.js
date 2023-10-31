'use strict';
exports.main = async (event, context) => {
	const code = event.params?.[0]?.code

	//event为客户端上传的参数
	console.log('code', code)

	if (code) {
		const result = await uniCloud.httpclient.request("https://api.weixin.qq.com/sns/jscode2session", {
			method: "GET",
			data: {
				'appid': "wx9a87e0f9be829c9c",
				'secret': "5d6d6313094f4a2251d4f9a560a1dbdb",
				'js_code': code,
				'grant_type': "authorization_code"
			},
			dataType: 'json'
		})
		
		return {
			openid: result.data.openid
		}
	}

	return {
		msg: 'openid获取失败'
	}
};