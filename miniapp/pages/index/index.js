//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    authed: undefined,
    userInfo: undefined,
  },
  //事件处理函数
  navigateToEditor: function() {
    wx.navigateTo({
      url: '../editor/index'
    })
  },
  onLoad: function() {
    const am = wx.getBackgroundAudioManager()
    am.onEnded(() => {
      am.src = 'http://pk1i5o4bn.bkt.clouddn.com/UNTITLED_DISC.mp3'
    })
    am.title = 'The Christmas Song'
    am.epname = 'Christmas Songs'
    am.singer = '手嶌葵'
    // am.autoplay = true
    // am.loop = true
    // am.coverImgUrl = ''
    am.src = 'http://pk1i5o4bn.bkt.clouddn.com/UNTITLED_DISC.mp3'
  },
  onShow: function () {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
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
        userInfo: app.globalData.userInfo,
      })
      // this.navigateToEditor()
    } else {
      this.setData({
        authed: false,
      })
    }
  },
})
