# svg-zoom
A light jQuery plugin for zooming svg.It is just 2 kb before gzip. 基于jQuery的简洁的svg放大缩小插件,普通压缩后仅2kb。

## quick start
1.add jquery and svg-zoom files

```html
  <script src="//code.jquery.com/jquery-3.1.1.min.js"></script>
  <script src="/path/SvgZoom.min.js"></script>
```

2.select a svg element to init
```javascript
  var svgZoom = new SvgZoom('#svgId')
```

## config

* If you want to override the defaults, you can optionally specify the arguments:

```javasctipt
  new SvgZoom('#svgId',{
      mouseWheel: true,
      zoomSpeed: 0.065,
      maxZoom: Number.POSITIVE_INFINITY,
      minZoom: 0.2,
      initZoom: 1,
      center: true,
      viewClass: 'svgzoom-view',
      zoomSelector: '',
      dragCursorStyle: 'move'
  })
```
