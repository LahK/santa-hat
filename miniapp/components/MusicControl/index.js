// components/MusicControl/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    paused: {
      type: Boolean,
      default: true,
    },
    darkmode: {
      type: Boolean,
      default: false,
    },
  },

  /**
   * Component initial data
   */
  data: {
    shouldShowNote: false,
  },

  ready() {
    const shouldShowNote = this.properties.paused
    this.setData({
      shouldShowNote,
    })

    setTimeout(() => {
      if (this.data.shouldShowNote) {
        this.setData({
          shouldShowNote: false,
        })
      }
    }, 72000)
  },
  /**
   * Component methods
   */
  methods: {
    getBoundingClientRect: function (selector) {
      return new Promise((resolve) => {
        wx.createSelectorQuery().in(this).select(selector).boundingClientRect().exec((res) => {
          resolve(res && res[0])
        })
      })
    },
    play() {
      this.setData({
        shouldShowNote: false,
      })
      this.triggerEvent('onplay')
    },
    pause() {
      this.triggerEvent('onpause')
    },
  },
})
