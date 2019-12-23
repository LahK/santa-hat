// pages/editor/index.js
// import cloud from 'wx-server-sdk'

import {
  getHDAvatarUrl,
  promisify
} from '../../utils'

const app = getApp()

let uuid = -1

const newUuid = () => {
  uuid += 1
  return uuid
}

Page({
  /**
   * Page initial data
   */
  data: {
    avatarUrl: undefined,
    avatarLoaded: false,
    availableHats: Array.from({
      length: 32
    }, (v, k) => k + 1),
    hats: [],
    isSaving: false,
    editor: {
      offset: {
        x: 0,
        y: 0,
      },
      size: {
        width: 0,
        height: 0,
      },
    },
    avatarTempFilePath: undefined,
    paused: true,
    authed: undefined,
    darkmode: app.globalData.darkmode,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.setData({
      paused: [true, undefined].includes(wx.getBackgroundAudioManager().paused),
      avatarUrl: this.getDefaultAvatarUrl(),
      avatarLoaded: false,
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    wx.createSelectorQuery().select('.editor').boundingClientRect(({
      left,
      top,
      width,
      height
    }) => {
      this.setData({
        editor: {
          offset: {
            x: left,
            y: top,
          },
          size: {
            width,
            height,
          },
        },
      })
    }).exec()
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            authed: true,
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

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {
    return {
      title: '要不要也来个圣诞小帽？',
      path: '/pages/index/index',
      imageUrl: this.data.avatarTempFilePath,
    }
  },


  getUserInfo: function(e) {
    if (e.errMsg === 'getUserInfo:ok' || e.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = e.userInfo || e.detail.userInfo
      this.setData({
        authed: true,
        userInfo: app.globalData.userInfo,
        avatarUrl: this.getDefaultAvatarUrl(),
        avatarLoaded: false,
      })
    } else {
      this.setData({
        authed: false,
      })
    }
  },

  onAvatarLoaded: function(e) {
    this.setData({
      avatarLoaded: true,
    })
  },

  onTapItem: function(e) {
    if (!this.data.avatarUrl) {
      wx.showToast({
        title: '请先上传头像',
        icon: 'none'
      })
      return
    }

    const {
      number
    } = e.currentTarget.dataset
    this.setData({
      hats: [
        ...this.data.hats,
        {
          number,
          id: newUuid(),
        },
      ],
    })
  },
  onItemChange: function({
    detail,
    currentTarget
  }) {
    const {
      id
    } = currentTarget.dataset
    const hats = this.data.hats
    const index = hats.findIndex((hat) => hat.id === id);

    if (index !== -1) {
      hats[index] = {
        ...hats[index],
        ...detail,
      }

      this.setData({
        hats,
      })
    }
  },
  onItemRemove: function({
    currentTarget
  }) {
    const {
      id
    } = currentTarget.dataset

    this.setData({
      hats: this.data.hats.filter((hat) => hat.id !== id),
    })
  },
  confirm: function() {
    this.setData({
      isSaving: true,
    })
  },
  closeConfirmDialog: function() {
    this.setData({
      isSaving: false,
    })
  },
  updateAvatarTempFilePath: function(e) {
    this.setData({
      avatarTempFilePath: e.detail,
    })
  },
  uploadPhoto: function() {
    // 已知 Bug：图片名称过长会导致上传之后的临时文件 path 成为非法 src
    promisify(wx.chooseImage)({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
      })
      .then((res) => {
        wx.showLoading({
          title: '图片校验中……',
          mask: true,
        })
        const path = res.tempFilePaths[0];
        this.setData({
          avatarUrl: path,
          avatarLoaded: false,
        })
        return path;
      })
      .then((path) => {
        return promisify(wx.cloud.uploadFile)({
          cloudPath: path.split("://")[1], // 上传至云端的路径
          filePath: path, // 小程序临时文件路径
        })
      })
      .then((res) => {
        const parts = this.data.avatarUrl.split('.')
        const type = parts[parts.length - 1];

        return wx.cloud.callFunction({
          name: 'imgSecCheck',
          data: {
            fileID: res.fileID,
            type: `image/${type}`,
          },
        })
      })
      .then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '校验成功！',
        })
      })
      .catch((err) => {
        console.error(err)

        this.setData({
          avatarUrl: this.getDefaultAvatarUrl(),
          avatarLoaded: false,
        })
        wx.hideLoading()
        
        if (err.errMsg === "chooseImage:fail cancel") {
          return;
        }

        wx.showToast({
          title: '校验失败，请更换头像图片！',
          icon: "none"
        })
      })
  },
  getDefaultAvatarUrl() {
    return app.globalData.userInfo ? getHDAvatarUrl(app.globalData.userInfo.avatarUrl) : undefined
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