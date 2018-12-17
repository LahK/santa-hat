// components/EditableImage/index.js

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
  },

  /**
   * Component initial data
   */
  data: {
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

  /**
   * Component methods
   */
  methods: {
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
    onTouchStart: function ({ target, touches }) {
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
    onTouchMove: function ({ target, touches }) {
      const { touchStart: { touches: _touches, offsetX, offsetY, width, height, angle } } = this.data
      if (touches.length === 1) {
        const touch = touches[0]
        const { pageX, pageY } = _touches[0]

        const movement = {
          x: touch.pageX - pageX,
          y: touch.pageY - pageY,
        }

        this.setData({
          offset: {
            x: offsetX + movement.x,
            y: offsetY + movement.y,
          },
        })
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

        const degree_angle = this.calcAngle(...points)
        const scale = this.calcScale(...points)

        this.setData({
          angle: angle + degree_angle,
          size: {
            width: width * scale,
            height: height * scale,
          },
          offset: {
            x: offsetX - (width * scale - width) / 2,
            y: offsetY - (height * scale - height) / 2,
          },
        })
      }
    },
    onTouchEnd: function (e) {
      console.log(e)
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
