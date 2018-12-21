//index.js
//获取应用实例
import { promisify } from '../../utils'

const app = getApp()

Page({
  data: {
    canvas: {
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight,
    },
    pixelRatio: wx.getSystemInfoSync().pixelRatio,
  },
  onShow: function () {
    this.drawNormal().then(() => {
      this.drawHD()
    })
  },
  drawHD: function () {
    return new Promise((resolve, reject) => {
      const ctx = wx.createCanvasContext('hd', this)
      const { pixelRatio } = wx.getSystemInfoSync()

      ctx.scale(pixelRatio, pixelRatio);

      ctx.drawImage('../../test.jpg', 0, 0, this.data.canvas.width * pixelRatio, this.data.canvas.height * pixelRatio)

      ctx.font = `21px "Hiragino Sans GB"`
      ctx.fillStyle = '#cc2832'
      ctx.fillText('圣诞快乐', 0, 64)
      ctx.draw(true, () => {
        this.save('hd', {
          width: this.data.canvas.width * pixelRatio,
          height: this.data.canvas.height * pixelRatio,
          destWidth: this.data.canvas.width * pixelRatio,
          destHeight: this.data.canvas.height * pixelRatio,
        }).then(() => {
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    })
  },
  drawNormal: function () {
    return new Promise((resolve, reject) => {
      const ctx = wx.createCanvasContext('normal', this)

      ctx.drawImage('../../test.jpg', 0, 0, this.data.canvas.width, this.data.canvas.height)

      ctx.font = `21px "Hiragino Sans GB"`
      ctx.fillStyle = '#cc2832'
      ctx.fillText('圣诞快乐', 0, 64)

      ctx.draw(true, () => {
        this.save('normal', {
          width: this.data.canvas.width,
          height: this.data.canvas.height,
        }).then(() => {
          resolve()
        }).catch((error) => {
          reject(error)
        })
      })
    })
  },
  save: function (canvasId, config = {}) {
    return new Promise((resolve, reject) => {

      const { windowWidth } = wx.getSystemInfoSync()

      promisify(wx.canvasToTempFilePath)({
        canvasId,
        ...config,
      }, this).then((res) => {
        promisify(wx.saveImageToPhotosAlbum)({
          filePath: res.tempFilePath,
        }).then(() => {
          wx.showToast({
            title: `已保存 ${canvasId} 到相册`,
          })
          resolve()
        }).catch(({ errMsg }) => {
          console.error(errMsg)
          if (errMsg === 'saveImageToPhotosAlbum:fail cancel') {
            wx.showToast({
              title: `取消保存 ${canvasId} 到相册`,
              icon: 'cancel',
            })
          } else {
            wx.showToast({
              title: `保存 ${canvasId} 到相册失败`,
              icon: 'cancel',
            })
          }
          reject(error)
        })
      }).catch((error) => {
        console.error(error)

        wx.hideLoading()

        wx.showToast({
          title: `保存 ${canvasId} 到相册失败`,
          icon: 'cancel',
        })

        reject(error)
      })
    })
  },
})
