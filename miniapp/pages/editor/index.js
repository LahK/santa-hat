// pages/editor/index.js
import { getHDAvatarUrl } from '../../utils'

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
    availableHats: Array.from({ length: 32 }, (v, k) => k + 1),
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
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      avatarUrl: getHDAvatarUrl(app.globalData.userInfo.avatarUrl),
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    wx.showLoading({
      title: '加载头像中……',
    })
    wx.createSelectorQuery().select('.editor').boundingClientRect(({ left, top, width, height }) => {
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
    return {
      title: '要不要也来个圣诞小帽？',
      path: '/pages/index/index',
      imageUrl: this.data.avatarTempFilePath,
    }
  },
  onImageLoad: function(e) {
    wx.hideLoading()
  },
  onTapItem: function(e) {
    const { number } = e.currentTarget.dataset
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
  onItemChange: function ({ detail, currentTarget }) {
    const { id } = currentTarget.dataset
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
  onItemRemove: function({ currentTarget }) {
    const { id } = currentTarget.dataset

    this.setData({
      hats: this.data.hats.filter((hat) => hat.id !== id),
    })
  },
  confirm: function() {
    this.setData({
      isSaving: true,
    })
  },
  closeConfirmDialog: function () {
    this.setData({
      isSaving: false,
    })
  },
  updateAvatarTempFilePath: function (e) {
    this.setData({
      avatarTempFilePath: e.detail,
    })
  },
})