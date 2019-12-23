//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isNavigating: false,
    paused: true,
    isHighlighting: false,
    currentYear: new Date().getUTCFullYear(),
    darkmode: app.globalData.darkmode,
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
      isHighlighting: true,
    })

    setTimeout(() => {
      this.setData({
        isHighlighting: false,
      })
    }, 2400)
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
  playAudio() {
    const am = wx.getBackgroundAudioManager()
    if (!am.src) {
      am.onEnded(() => {
        am.src = 'https://7361-santa-hat-1300390218.tcb.qcloud.la/The%20Christmas%20Song.mp3?sign=44c9700da2268df8ac35382c816cf834&t=1576668897'
      })
      am.title = 'The Christmas Song'
      am.epname = 'Christmas Songs'
      am.singer = '手嶌葵'
      am.coverImgUrl = 'https://raw.githubusercontent.com/LahK/santa-hat/master/miniapp/assets/santa-deer.png'
      am.src = 'https://7361-santa-hat-1300390218.tcb.qcloud.la/The%20Christmas%20Song.mp3?sign=44c9700da2268df8ac35382c816cf834&t=1576668897'
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
