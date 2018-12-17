// pages/editor/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: undefined,
    canvas: {
      width: wx.getSystemInfoSync().windowWidth * 0.8,
      height: wx.getSystemInfoSync().windowWidth * 0.8,
    },
    avatar: {
      width: 0,
      height: 0,
      offsetY: 0,
      offsetYMax: 0,
    },
    touch: {

    },
    availableHats: Array.from({ length: 14 }, (v, k) => k + 1),
    hats: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    // wx.getImageInfo({
    //   src: app.globalData.userInfo.avatarUrl,
    //   success: (res) => {
    //     const ctx = wx.createCanvasContext('lahk')
    //     ctx.drawImage(res.path, 0, 0, this.data.canvas.width, this.data.canvas.height)
    //     ctx.draw()
    //   },
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
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
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  onImageLoad: function (e) {
    console.log(e)
    // const width = this.data.canvas.width
    // const height = width * e.detail.height / e.detail.width
    // this.setData({
    //   avatar: {
    //     width,
    //     height,
    //     offsetYMax: height - width,
    //   },
    // })
  },
  onTouchStart: function(e) {
    console.log(e)
  },
  onTouchMove: function (e) {
    console.log(e)
  },
  onTapItem: function(e) {
    const { number } = e.currentTarget.dataset
    this.setData({
      hats: [...this.data.hats, number],
    })
  },
})