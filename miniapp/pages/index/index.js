//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    authed: undefined,
    userInfo: undefined,
    isNavigating: false,
    paused: true,
    isHighlighting: false,
    currentYear: new Date().getUTCFullYear(),
  },
  //事件处理函数
  navigateToEditor: function() {
    this.setData({
      isNavigating: true,
    })

    setTimeout(() => {
      wx.navigateTo({
        url: '../editor/index'
      })
    }, 700)
  },
  onShow: function () {
    this.setData({
      isNavigating: false,
    })
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
        isHighlighting: true,
      })
      
      setTimeout(() => {
        this.setData({
          isHighlighting: false,
        })
      }, 2400)
    } else {
      this.setData({
        authed: false,
      })
    }
  },
  playAudio() {
    const am = wx.getBackgroundAudioManager()
    if (!am.src) {
      am.onEnded(() => {
        am.src = 'cloud://santa-hat.7361-santa-hat/The Christmas Song.mp3'
      })
      am.title = 'The Christmas Song'
      am.epname = 'Christmas Songs'
      am.singer = '手嶌葵'
      am.coverImgUrl = 'https://raw.githubusercontent.com/LahK/santa-hat/master/miniapp/assets/santa-deer.png'
      am.src = 'cloud://santa-hat.7361-santa-hat/The Christmas Song.mp3'
    } else {
      am.play()
    }

    this.setData({
      paused: false,
    })
  },
  pauseAudio() {
    const am = wx.getBackgroundAudioManager()
    am.pause()

    this.setData({
      paused: true,
    })
  },
})
