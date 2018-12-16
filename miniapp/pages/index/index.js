//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    authed: undefined,
  },
  //事件处理函数
  navigateToEditor: function() {
    wx.navigateTo({
      url: '../editor/index'
    })
  },
  onShow: function () {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            authed: true,
          })
          wx.getUserInfo({
            complete: this.getUserInfo,
          })
        } else {
          this.setData({
            authed: false,
          })
        }
      },
      fail: () => {
        this.setData({
          authed: false,
        })
      },
    })
  },
  getUserInfo: function(e) {
    if (e.errMsg === 'getUserInfo:ok' || e.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = e.userInfo || e.detail.userInfo
      this.setData({
        authed: true,
      })
      this.navigateToEditor()
    } else {
      this.setData({
        authed: false,
      })
    }
  },
})
