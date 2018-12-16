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
      value: 45,
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
      const { type } = target.dataset

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
      const { type } = target.dataset

      if (touches.length === 1) {
        const touch = touches[0]
        const { touchStart: { touches: _touches, offsetX, offsetY, width, height } } = this.data
        const { pageX, pageY } = _touches[0]
        const movement = {
          x: touch.pageX - pageX,
          y: touch.pageY - pageY,
        }

        if (type === 'image') {
          this.setData({
            offset: {
              x: offsetX + movement.x,
              y: offsetY + movement.y,
            },
          })
        } else if (type.startsWith('resize-')) {
          if (type === 'resize-nw') {
            this.setData({
              offset: {
                x: offsetX + movement.x,
                y: offsetY + movement.y,
              },
              size: {
                width: width - movement.x,
                height: height - movement.y,
              },
            })
          } else if (type === 'resize-ne') {
            this.setData({
              offset: {
                x: offsetX,
                y: offsetY + movement.y,
              },
              size: {
                width: width + movement.x,
                height: height - movement.y,
              },
            })
          } else if (type === 'resize-sw') {
            this.setData({
              offset: {
                x: offsetX + movement.x,
                y: offsetY,
              },
              size: {
                width: width - movement.x,
                height: height + movement.y,
              },
            })
          } else if (type === 'resize-se') {
            this.setData({
              offset: {
                x: offsetX,
                y: offsetY,
              },
              size: {
                width: width + movement.x,
                height: height + movement.y,
              },
            })
          }
        }
      } else if (touches.length === 2) {
        const { touchStart: { touches: _touches, offsetX, offsetY, width, height } } = this.data
        const degree_angle = this.calculateAngle(
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
        )

        this.setData({
          angle: degree_angle,
        })
      }
    },
    onTouchEnd: function (e) {
      this.setData({
        touchStart: null,
      })
    },
    calculateAngle: function (a1, a2, b1, b2) {
      const dAx = a2.x - a1.x;
      const dAy = a2.y - a1.y;
      const dBx = b2.x - b1.x;
      const dBy = b2.y - b1.y;
      let angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
      const degree_angle = angle * (180 / Math.PI);
      return degree_angle
    }
  }
})
