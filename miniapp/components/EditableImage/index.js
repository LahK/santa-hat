// components/EditableImage/index.js

const debounce = (fn, time = 300) => {
  let timeout;

  return function () {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

Component({
  /**
   * Component properties
   */
  properties: {
    src: {
      type: String,
      value: undefined,
    },
    defaultWidth: {
      type: Number,
      value: 75,
    },
    editorOffset: {
      type: Object,
      value: {
        x: 0,
        y: 0,
      },
    },
    onChange: {
      type: Function,
      value: () => {},
    },
  },

  /**
   * Component initial data
   */
  data: {
    isControlDisplaying: true,
    size: {
      width: 0,
      height: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    angle: 0,
    touchStart: null, 
  },
  ready() {
    this.onChange()
  },

  /**
   * Component methods
   */
  methods: {
    toggleControlDisplay: function() {
      this.setData({
        isControlDisplaying: !this.data.isControlDisplaying,
      })
    },
    onChange: debounce(function () {
      this.triggerEvent('onchange', {
        size: this.data.size,
        offset: this.data.offset,
        angle: this.data.angle,
      })
    }),
    onRemove: function(e) {
      this.triggerEvent('onremove')
    },
    onImageLoad: function (e) {
      const width = this.properties.defaultWidth
      const height = width * e.detail.height / e.detail.width
      this.setData({
        size: {
          width,
          height,
        }
      })
    },
    onTouchStart: function ({ touches }) {
      const { offset: { x, y }, size: { width, height }, angle } = this.data
      this.setData({
        touchStart: {
          width,
          height,
          offsetX: x,
          offsetY: y,
          touches,
          angle,
        },
      })
    },
    onTouchMove({ currentTarget: { dataset: { id } }, touches }) {
      const { touchStart: { touches: _touches, offsetX, offsetY, width, height, angle } } = this.data

      let angleChange = 0
      let scale = 1
      let offsetChange = {
        x: 0,
        y: 0,
      }

      if (id === 'image') {
        if (touches.length === 1) {
          const touch = touches[0]
          const { pageX, pageY } = _touches[0]

          offsetChange.x = touch.pageX - pageX
          offsetChange.y = touch.pageY - pageY
        } else if (touches.length === 2) {
          const points = [
            {
              x: _touches[0].pageX,
              y: _touches[0].pageY,
            },
            {
              x: _touches[1].pageX,
              y: _touches[1].pageY,
            },
            {
              x: touches[0].pageX,
              y: touches[0].pageY,
            },
            {
              x: touches[1].pageX,
              y: touches[1].pageY,
            },
          ]

          angleChange = this.calcAngle(...points)
          scale = this.calcScale(...points)

          offsetChange.x = -(width * scale - width) / 2
          offsetChange.y = -(height * scale - height) / 2
        }
      } else {
        if (touches.length === 1) {
          const { editorOffset } = this.properties
          const centerPoint = {
            x: offsetX + width / 2,
            y: offsetY + height / 2,
          }

          console.log(_touches[0], editorOffset)

          const points = [
            centerPoint,
            {
              x: _touches[0].pageX - editorOffset.x,
              y: _touches[0].pageY - editorOffset.y,
            },
            centerPoint,
            {
              x: touches[0].pageX - editorOffset.x,
              y: touches[0].pageY - editorOffset.y,
            },
          ]
          if (id === 'resize') {
            scale = this.calcScale(...points)

            offsetChange.x = -(width * scale - width) / 2
            offsetChange.y = -(height * scale - height) / 2
          } else if (id === 'rotate') {
            angleChange = this.calcAngle(...points)
          }
        }
      }

      this.setData({
        angle: angle + angleChange,
        size: {
          width: width * scale,
          height: height * scale,
        },
        offset: {
          x: offsetX + offsetChange.x,
          y: offsetY + offsetChange.y,
        },
      })

      this.onChange()
    },
    onTouchEnd: function (e) {
      this.setData({
        touchStart: null,
      })
    },
    calcAngle: function (a1, a2, b1, b2) {
      const dAx = a2.x - a1.x;
      const dAy = a2.y - a1.y;
      const dBx = b2.x - b1.x;
      const dBy = b2.y - b1.y;
      let angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
      const degree_angle = angle * (180 / Math.PI);
      return degree_angle
    },
    calcScale: function (a1, a2, b1, b2) {
      function calcLength(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
      }

      return calcLength(b1, b2) / calcLength(a1, a2)
    },
    catchOnTouchStart: function () {
      return
    },
    catchOnTouchMove: function () {
      return
    },
    catchOnTouchEnd: function () {
      return
    },
  }
})
