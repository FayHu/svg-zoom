/**
 * Created by hWX336970 on 2017/6/5.
 */
(function (exports, $) {
  var
    DATA_KEY = 'data.svgzoom',
    NS_SVG = 'http://www.w3.org/2000/svg'

  /**
   * SvgZoom
   * @param {Object} ele
   * @param {Object} opts
   */
  function SvgZoom(ele, opts) {

    this.$element = $(ele)
    this.element = this.$element[0]

    if (!this.element instanceof SVGElement)
      throw new Error('SvgZoom element must be svg')

    if (this.$element.data(DATA_KEY)) return

    this.$element.data(DATA_KEY, this)
    this.options = $.extend({}, SvgZoom.Defaults, opts)

    this._init()
  }

  SvgZoom.Defaults = {
    //mouseWheel enable
    mouseWheel: true,
    zoomSpeed: 0.065,
    maxZoom: Number.POSITIVE_INFINITY,
    minZoom: 0.2,
    initZoom: 1,
    center: true,
    viewClass: 'svgzoom-view',
    zoomSelector: '',
    dragCursorStyle: 'move'
  }

  SvgZoom.prototype = {
    _init: function () {
      this.isDrag = false
      this.dragStartX = 0
      this.dragStartY = 0
      this.state = {
        x: 0,
        y: 0,
        zoom: this.options.initZoom
      }

      //add view wraper
      var
        $content = this.$element.children(this.options.zoomSelector)

      this.$view = $(document.createElementNS(NS_SVG, 'g')).attr('class', this.options.viewClass)
      this.view = this.$view.get(0)

      this.$element.append(this.$view.append($content))

      this.update()

      if (this.options.center) this.center()
      //need twice update to get real size of view

      this._bind()
    },

    _bind: function () {
      this.$element
        .on('mousedown', $.proxy(this._handleMouseDown, this))
        .on('mouseup', $.proxy(this._handleMouseUp, this))
        .on('mousemove', $.proxy(this._handleMouseMove, this))
        .on('mouseout', $.proxy(this._handleMouseUp, this))
        .on('mousewheel DOMMouseScroll', $.proxy(this._handleMouseWheel, this))

    },

    _handleMouseDown: function (e) {
      e.preventDefault()
      this.isDrag = true;
      this.dragStartX = e.clientX
      this.dragStartY = e.clientY
    },

    _handleMouseUp: function (e) {
      e.preventDefault()
      this.isDrag = false
      this.view.style.cursor = ''
    },

    _handleMouseMove: function (e) {
      e.preventDefault()

      if (this.isDrag) {
        var
          diffX = e.clientX - this.dragStartX,
          diffY = e.clientY - this.dragStartY,
          viewBoxScale = this._getViewBoxScale()

        this.view.style.cursor = this.options.dragCursorStyle
        this.state.x += (diffX / viewBoxScale)
        this.state.y += (diffY / viewBoxScale)

        this.update()
      }

      this.dragStartX = e.clientX
      this.dragStartY = e.clientY
    },

    _handleMouseWheel: function (e) {
      var
        opts = this.options,
        delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail > 0 ? -1 : 1)

      if (opts.mouseWheel) {
        this.setZoom(this.state.zoom * (1 + opts.zoomSpeed * delta ))
      }
    },

    _getViewBoxScale: function () {
      //the scale should contain custom zoom
      return this.viewBoxScale = this.view.getBoundingClientRect().width / this.element.viewBox.baseVal.width / this.state.zoom;
    },

    setZoom: function (zoom) {
      var
        viewRect = this.view.getBoundingClientRect(),
        deltaZoom = zoom - this.state.zoom,
        scale = this._getViewBoxScale()

      this.state.zoom = zoom
      //set zoom origin
      this.state.x -= deltaZoom * viewRect.width / 2/scale
      this.state.y -= deltaZoom * viewRect.height / 2/scale

      this.update()
      return this
    },

    setMouseWheel: function (enable) {
      this.options.mouseWheel = !!enable
      return this
    },

    center: function () {
      var
        eleRect = this.element.getBoundingClientRect(),
        viewRect = this.view.getBoundingClientRect(),
        viewBoxScale = this._getViewBoxScale()

      this.state.x += ((eleRect.width - viewRect.width) / 2 - (viewRect.left - eleRect.left)) / viewBoxScale
      this.state.y += ((eleRect.height - viewRect.height) / 2 - (viewRect.top - eleRect.top)) / viewBoxScale

      this.update()

      return this
    },

    update: function () {
      var
        opts = this.options

      if (this.state.zoom < opts.minZoom) this.state.zoom = opts.minZoom
      if (this.state.zoom > opts.maxZoom) this.state.zoom = opts.maxZoom

      this.$view.attr('transform', 'translate(' + this.state.x + ',' + this.state.y + ') scale(' + this.state.zoom + ')')
      return this
    }
  }
  exports.SvgZoom = SvgZoom
})(UCD, jQuery)
