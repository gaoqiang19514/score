export const setOpenid = (openid) => {
  wx.setStorageSync('openid', openid)
}

export const getOpenid = () => {
  return wx.getStorageSync('openid')
}