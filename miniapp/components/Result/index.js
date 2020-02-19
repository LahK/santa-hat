// components/Result/index.js
import { promisify, getRandomInt, getPosterYear } from '../../utils'

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
    posterYear: getPosterYear(),
    borderImgNumber: getRandomInt(5),
    avatarTempFilePath: '',
    view: {
      poster: {
        width: 298,
        height: 417,
      },
      border: {
        left: 0,
        top: 0,
        width: 298,
        height: 417,
      },
      avatar: {
        left: 0,
        top: 64,
        width: 120,
        height: 120,
      },
      qrcode: {
        left: 0,
        top: 208,
        width: 64,
        height: 64,
      },
      merryXmasText: {
        left: 0,
        top: 280,
      },
      dashLeft: {
        left: 0,
        top: 319,
        width: 32,
        height: 1,
      },
      yearText: {
        left: 0,
        top: 312,
      },
      dashRight: {
        left: 0,
        top: 319,
        width: 32,
        height: 1,
      },
      peaceText: {
        left: 0,
        top: 330,
      },
      metaText: {
        left: 0,
        top: 364,
      },
    },
    canvas: {
      avatar: {
        width: undefined,
        height: undefined,
      },
      poster: {
        width: 298 * wx.getSystemInfoSync().pixelRatio,
        height: 417 * wx.getSystemInfoSync().pixelRatio,
        letterSpacing: 2.5,
      },
    },
  },

  ready: function () {
    wx.showLoading({
      title: '准备中……',
      mask: true,
    })

    this.repositionPoster()
      .then(() => {
        wx.hideLoading()

        return this.draw()
      })
  },

  /**
   * Component methods
   */
  methods: {
    close: function() {
      this.triggerEvent('onclose')
    },
    getBoundingClientRect: function (selector) {
      return new Promise((resolve) => {
        wx.createSelectorQuery().in(this).select(selector).boundingClientRect().exec((res) => {
          resolve(res && res[0])
        })
      })
    },
    getBoundingClientRectList: function (selectors) {
      return Promise.all(selectors.map((selector) => this.getBoundingClientRect(selector)))
    },
    repositionPoster: function() {
      return new Promise((resolve, reject) => {
        this.getBoundingClientRectList([
          '#merryXmasText',
          '#yearText',
          '#peaceText',
          // '#metaText',
        ]).then((rects) => {
          const { poster, avatar, qrcode, merryXmasText, yearText, peaceText, metaText, dashLeft, dashRight } = this.data.view

          const calcLeft = (width) => (poster.width - width) / 2
          const calcTop = (height) => (poster.height - height) / 2

          this.setData({
            view: {
              ...this.data.view,
              avatar: {
                ...avatar,
                left: calcLeft(avatar.width),
              },
              qrcode: {
                ...qrcode,
                left: calcLeft(qrcode.width),
              },
              merryXmasText: {
                ...merryXmasText,
                left: calcLeft(rects[0].width),
                width: rects[0].width,
                height: rects[0].height,
              },
              yearText: {
                ...yearText,
                left: calcLeft(rects[1].width),
                width: rects[1].width,
                height: rects[1].height,
              },
              peaceText: {
                ...peaceText,
                left: calcLeft(rects[2].width),
                width: rects[2].width,
                height: rects[2].height,
              },
              // metaText: {
              //   ...metaText,
              //   left: calcLeft(rects[3].width),
              //   width: rects[3].width,
              //   height: rects[3].height,
              // },
              dashLeft: {
                ...dashLeft,
                left: calcLeft(rects[1].width) - 8 - dashLeft.width,
              },
              dashRight: {
                ...dashRight,
                left: calcLeft(rects[1].width) + rects[1].width + 8,
              },
            }
          })

          resolve()
        })
      })
    },
    draw: function () {
      wx.showLoading({
        title: '生成中……',
        mask: true,
      })

      this.drawAvatar()
        .then((canvasId) => {
          const { pixelRatio } = wx.getSystemInfoSync()

          return this.saveTempFile(canvasId, {
            width: this.data.canvas.avatar.width,
            height: this.data.canvas.avatar.width,
            destWidth: this.data.canvas.avatar.width / pixelRatio,
            destHeight: this.data.canvas.avatar.width / pixelRatio,
          })
        })
        .then(({ tempFilePath }) => {
          this.setData({
            avatarTempFilePath: tempFilePath,
          })

          this.triggerEvent('onavatarsave', tempFilePath)

          return this.drawPoster()
        })
        .then((canvasId) => {
          return this.saveTempFile(canvasId, {
            width: this.data.canvas.poster.width,
            height: this.data.canvas.poster.height,
            destWidth: this.data.canvas.poster.width,
            destHeight: this.data.canvas.poster.height,
          })
        })
        .then(({ tempFilePath }) => {
          this.setData({
            posterTempFilePath: tempFilePath,
          })

          return Promise.resolve()
        })
        .then(() => {
          wx.hideLoading()

          wx.showToast({
            title: '头像和海报生成成功！',
            icon: 'none',
          })
        })
        .catch((error) => {
          console.error(error)
          wx.hideLoading()
          wx.showToast({
            title: '生成失败，请重试……',
            icon: 'none',
          })

          this.close()
        })
    },
    drawPoster: function() {
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '绘制海报中……',
          mask: true,
        })
        const { poster, border, avatar, qrcode, merryXmasText, yearText, peaceText, metaText, dashLeft, dashRight } = this.data.view

        const { pixelRatio } = wx.getSystemInfoSync()

        const ctx = wx.createCanvasContext('poster', this)

        ctx.scale(pixelRatio, pixelRatio)

        // draw background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(
          0,
          0,
          poster.width,
          poster.height,
        )

        // draw border
        ctx.drawImage(`../../assets/border/${this.data.borderImgNumber}.png`, border.left , border.top , border.width , border.height)

        // draw avatar
        ctx.drawImage(
          this.data.avatarTempFilePath,
          avatar.left ,
          avatar.top ,
          avatar.width,
          avatar.height,
        )

        // draw qrcode
        ctx.drawImage(
          '../../assets/qrcode.jpeg',
          qrcode.left,
          qrcode.top,
          qrcode.width,
          qrcode.height,
        )

        // draw texts
        ctx.font = `500 21px "Hiragino Sans GB"`
        ctx.fillStyle = '#cc2832'
        ctx.fillText('圣诞快乐', merryXmasText.left + 3, merryXmasText.top + 20)
        ctx.fillText('愿世界和平', peaceText.left + 5, peaceText.top + 20)

        ctx.font = `500 10px "Hiragino Sans GB"`
        ctx.fillStyle = '#18563b'
        ctx.fillText(this.data.posterYear, yearText.left + 4, yearText.top + 8)

        ctx.fillRect(
          dashLeft.left + 3,
          dashLeft.top - 4,
          dashLeft.width,
          dashLeft.height,
        )
        ctx.fillRect(
          dashRight.left - 2,
          dashRight.top - 4,
          dashRight.width,
          dashRight.height,
        )

        // this.setData({
        //   'canvas.poster.letterSpacing': 1,
        // })
        // ctx.font = `8px "Hiragino Sans GB"`
        // ctx.fillStyle = '#000000'
        // ctx.fillText('圣诞小帽 · Santa Hat - LahK', metaText.left, metaText.top + 8)

        ctx.draw(true, () => {
          resolve('poster')
        })
      })
    },
    drawAvatar: function() {
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '绘制头像中……',
          mask: true,
        })
        const { avatarUrl, hats, editorSize } = this.properties

        promisify(wx.getImageInfo)({
          src: avatarUrl,
        }).then((res) => {
          const { width, path } = res;
          console.log(res)
          this.updateAvatarCanvasSize(width)
          
          const ctx = wx.createCanvasContext('avatar', this)

          const { width: avatarWidth } = this.data.canvas.avatar
          const { pixelRatio } = wx.getSystemInfoSync()

          const canvasAndEditorScale = width / editorSize.width

          ctx.drawImage(path, 0, 0, avatarWidth, avatarWidth)

          hats.forEach((hat, idx) => {
            wx.showLoading({
              title: `绘制圣诞小帽${idx+1}中……`,
              mask: true,
            })
            this.drawHat(ctx, hat, canvasAndEditorScale * pixelRatio)
          })

          ctx.draw(true, () => {
            resolve('avatar')
          })
        }).catch((error) => reject(error))
      })
    },
    drawHat: function (ctx, hat, scale = 1) {
      const angle = hat.angle * Math.PI / 180
      ctx.translate((hat.offset.x + hat.size.width / 2) * scale, (hat.offset.y + hat.size.height / 2) * scale)
      ctx.rotate(angle)
      ctx.drawImage(`../../assets/hat/${hat.number}.png`, -hat.size.width / 2 * scale, -hat.size.height / 2 * scale, hat.size.width * scale, hat.size.height * scale)
      ctx.rotate(-angle)
      ctx.translate(-(hat.offset.x + hat.size.width / 2) * scale, -(hat.offset.y + hat.size.height / 2) * scale)
    },
    updateAvatarCanvasSize: function(width) {
      const { pixelRatio } = wx.getSystemInfoSync()
      this.setData({
        canvas: {
          ...this.data.canvas,
          avatar: {
            width: width * pixelRatio,
            height: width * pixelRatio,
          },
        },
      })
    },
    saveTempFile: function (canvasId, config = {}) {
      return promisify(wx.canvasToTempFilePath)({
        canvasId,
        ...config,
      }, this)
    },
    saveToAlbum: function (filePath) {
      return promisify(wx.saveImageToPhotosAlbum)({
        filePath,
      })
    },
    save: function () {
      wx.showLoading({
        title: '保存中……',
        mask: true,
      })

      this.saveToAlbum(this.data.avatarTempFilePath)
        .then(() => {
          return this.saveToAlbum(this.data.posterTempFilePath)
        })
        .then(() => {
          wx.hideLoading()

          wx.showToast({
            title: '已保存到相册',
            duration: 3000,
          })
        })
        .catch((error) => {
          wx.hideLoading()

          console.error(error)

          if (error.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
            wx.showToast({
              title: '取消保存到相册',
              icon: 'none',
            })
          } else {
            wx.showToast({
              title: '保存到相册失败',
              icon: 'none',
            })
          }
        })
    }
  },
})
