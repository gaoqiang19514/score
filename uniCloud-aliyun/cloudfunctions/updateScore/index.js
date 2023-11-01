'use strict';
exports.main = async (event, context) => {
  const code = event.code;

  //event为客户端上传的参数
  console.log('code', code)


  if (code) {
    const result = await uniCloud.httpProxyForEip.get("https://api.weixin.qq.com/sns/jscode2session", {
      'js_code': code,
      'appid': "wx9a87e0f9be829c9c",
      'secret': "5d6d6313094f4a2251d4f9a560a1dbdb",
      'grant_type': "authorization_code"
    })

    return result.body
  }

  console.log('uniCloud.logger', uniCloud.logger)

  return {
    msg: 'openid获取失败'
  }
};