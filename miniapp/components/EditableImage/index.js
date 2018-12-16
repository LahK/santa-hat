// components/EditableImage/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    src: {
      type: String,
      value: undefined,
    }
  },

  /**
   * Component initial data
   */
  data: {
    size: {
      width: 0,
      height: 0,
    },
  },

  /**
   * Component methods
   */
  methods: {
    onImageLoad: function (e) {
      const width = wx.getSystemInfoSync().windowWidth * 0.8
      const height = width * e.detail.height / e.detail.width
      this.setData({
        imageSize: {
          width,
          height,
        }
      })
    }
  }
})
