// components/Result/index.js
import { promisify, getRandomInt } from '../../utils'

Component({
  /**
   * Component properties
   */
  properties: {
    avatarUrl: {
      type: String,
    },
    hats: {
      type: Array,
    },
    editorSize: {
      type: Object,
    },
  },

  /**
   * Component initial data
   */
  data: {
    borderiImgNumber: getRandomInt(5),
    avatarWidth: undefined,
    canvasSize: {
      width: wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().pixelRatio,
      height: wx.getSystemInfoSync().windowHeight * wx.getSystemInfoSync().pixelRatio,
    },
    posterSize: {
      width: wx.getSystemInfoSync().windowWidth * 0.72,
      height: wx.getSystemInfoSync().windowWidth * 0.72 * (wx.getSystemInfoSync().windowHeight / wx.getSystemInfoSync().windowWidth),
    },
  },

  ready: function() {
    this.draw()
  },

  /**
   * Component methods
   */
  methods: {
    close: function() {
      this.triggerEvent('onclose')
    },
    draw: function () {
      const that = this
      function getBoundingClientRect(selector) {
        return new Promise((resolve) => {
          wx.createSelectorQuery().in(that).select(selector).boundingClientRect().exec((res) => {
            resolve(res && res[0])
          })
        })
      }

      function getBoundingClientRectList(selectors) {
        return Promise.all(selectors.map((selector) => getBoundingClientRect(selector)))
      }

      wx.showLoading({
        title: '生成中……',
        mask: true,
      })

      getBoundingClientRectList([
        '#border',
        '#avatar',
        '#text-1',
        '#line-1',
        '#year',
        '#line-2',
        '#text-2',
      ]).then((rects) => {
        const _rects = {}
        rects.forEach((rect) => {
          _rects[rect.id] = rect
        })

        this.drawAvatar().then(() => {
          this.drawPoster(_rects).then(() => {
            wx.hideLoading()
          })
        }).catch((error) => {
          console.error(err)
          wx.hideLoading()
          wx.showToast({
            title: '生成失败，请重试',
            icon: 'cancel',
          })

          this.close()
        })
      })
    },
    drawPoster: function(rects) {
      return new Promise((resolve, reject) => {
        resolve()
        // console.log(rects)
        // const ctx = wx.createCanvasContext('poster', this)

        // const { width, height } = this.data.posterSize

        // const canvasAndFileScale = width / wx.getSystemInfoSync().windowWidth
        // // ctx.scale(canvasAndFileScale, canvasAndFileScale)
        // console.log(wx.getSystemInfoSync().pixelRatio)
        // ctx.scale(wx.getSystemInfoSync().pixelRatio, wx.getSystemInfoSync().pixelRatio);

        // const baseOffset = {
        //   x: rects['border'].left,
        //   y: rects['border'].top,
        // }

        // // draw border
        // ctx.drawImage(`../../assets/border/${this.data.borderiImgNumber}.png`, 0, 0, wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight)

        // // draw red texts
        // console.log(21 / canvasAndFileScale)
        // ctx.font = `${Math.round(21 / canvasAndFileScale)}px "Hiragino Sans GB"`
        // ctx.fillStyle = '#cc2832'
        // ctx.fillText('圣诞快乐', (rects['text-1'].left - baseOffset.x) / canvasAndFileScale, (rects['text-1'].top - baseOffset.y) / canvasAndFileScale)

        // // hats.forEach((hat) => {
        // //   this.drawHat(ctx, canvasAndEditorScale, hat)
        // // })

        // ctx.draw(true, () => {
        //   resolve()
        // })
      })
    },
    drawAvatar: function() {
      return new Promise((resolve, reject) => {
        const { avatarUrl, hats, editorSize } = this.properties

        promisify(wx.getImageInfo)({
          src: avatarUrl,
        }).then(({ width, height, path }) => {
          this.setData({
            avatarWidth: width,
          })
          const ctx = wx.createCanvasContext('avatar', this)

          const canvasAndFileScale = 120 / width
          ctx.scale(canvasAndFileScale, canvasAndFileScale)

          const canvasAndEditorScale = width / editorSize.width

          ctx.drawImage(path, 0, 0, width, width)

          hats.forEach((hat) => {
            this.drawHat(ctx, canvasAndEditorScale, hat)
          })

          ctx.draw(true, () => {
            resolve()
          })
        }).catch((error) => reject(error))
      })
    },
    drawHat: function (ctx, scale, hat) {
      const angle = hat.angle * Math.PI / 180
      ctx.translate((hat.offset.x + hat.size.width / 2) * scale, (hat.offset.y + hat.size.height / 2) * scale)
      ctx.rotate(angle)
      ctx.drawImage(`../../assets/hat/${hat.number}.png`, -hat.size.width / 2 * scale, -hat.size.height / 2 * scale, hat.size.width * scale, hat.size.height * scale)
      ctx.rotate(-angle)
      ctx.translate(-(hat.offset.x + hat.size.width / 2) * scale, -(hat.offset.y + hat.size.height / 2) * scale)
    },
    save: function () {
      const { avatarWidth } = this.data
      promisify(wx.canvasToTempFilePath)({
        canvasId: 'avatar',
        width: avatarWidth,
        height: avatarWidth,
        complete: () => {
          wx.hideLoading()
          this.setData({
            isSaving: false,
          })
        }
      }, this).then((res) => {
        promisify(wx.saveImageToPhotosAlbum)({
          filePath: res.tempFilePath,
        }).then(() => {
          wx.showToast({
            title: '已保存到相册',
          })
        }).catch(({ errMsg }) => {
          console.error(errMsg)
          if (errMsg === 'saveImageToPhotosAlbum:fail cancel') {
            wx.showToast({
              title: '取消保存到相册',
              icon: 'cancel',
            })
          } else {
            wx.showToast({
              title: '保存到相册失败',
              icon: 'cancel',
            })
          }
        })
      }).catch((error) => {
        console.error(error)
        wx.hideLoading()
        this.setData({
          drawingFinished: true,
        })
        wx.showToast({
          title: '保存到相册失败',
          icon: 'cancel',
        })
      })
    }
  },
})
