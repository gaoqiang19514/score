// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
  /**
   * 使用code换取openid
   * @param {string} code
   * @returns {object}
   */
  async getOpenid(code) {
    console.log('uniCloud.logger', uniCloud.logger)

    // 参数校验，如无参数则不需要
    if (!code) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空'
      }
    }

    // 调用微信官方接口，换取openid
    if (code) {
      const result = await uniCloud.httpProxyForEip.get("https://api.weixin.qq.com/sns/jscode2session", {
        'js_code': code,
        'appid': "wx9a87e0f9be829c9c",
        'secret': "5d6d6313094f4a2251d4f9a560a1dbdb",
        'grant_type': "authorization_code"
      })

      const data = JSON.parse(result.body)

      if (!data.openid) {
        return {
          "errCode": '-1',
          "errMsg": '获取openid失败'
        }
      }

      return {
        openid: data.openid
      }
    }

    return {
      "errCode": '-1',
      "errMsg": '获取openid失败'
    }
  },
  async setUserAvatar(url, openid) {
    console.log('uniCloud.logger', uniCloud.logger)

    // 参数校验，如无参数则不需要
    if (!url) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空'
      }
    }

    const db = uniCloud.database();
    const collection = db.collection('score');

    await collection.where({
      openid
    }).update({
      avatar: url
    })

    return {
      "errCode": '',
      "errMsg": ''
    }
  },
  async setNickname(nickname, openid) {
    console.log('uniCloud.logger', uniCloud.logger)

    // 参数校验，如无参数则不需要
    if (!nickname) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空'
      }
    }

    const db = uniCloud.database();
    const collection = db.collection('score');

    await collection.where({
      openid
    }).update({
      nickname
    })

    return {
      "errCode": '',
      "errMsg": ''
    }
  },
  async getUserinfo(openid) {
    // 参数校验，如无参数则不需要
    if (!openid) {
      return {
        errCode: 'PARAM_IS_NULL',
        errMsg: '参数不能为空'
      }
    }

    const db = uniCloud.database();
    const collection = db.collection('score');

    const res = await collection.where({
      openid
    }).get();

    if (!res.data.length) {
      return {
        errCode: '-1',
        errMsg: '获取用户信息失败'
      }
    }

    return res.data[0]
  }
}