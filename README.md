# Pointerevents Drag n' Drop

Drag and drop for pointerevents.

## Dependencies

- A polyfill for pointerevents (I used [the Polymer one](https://github.com/Polymer/PointerEvents))
- jQuery or Zepto

## Events

- pointerdragstart
- pointerdragend
- pointerdragenter
- pointerdragover
- pointerdragleave
- pointerdrop

## How to use

```javascript
var element_or_$elements = $("[draggable]");
var instance = new PointerEventsDragnDrop(element_or_$elements, options);

$(".drop-zone").on("pointerdrop", function() {
  alert("Dropped it!");
});
```

Check [the demo](https://github.com/icidasset/pointerevents-dragndrop/tree/master/demo/demo.js) for a better example.

## Settings

```javascript
// with defaults
delegate_selector = false;
drag_icon_classname = "drag-icon";
```

## To do

- Remove jQuery/Zepto dependency
- Them' bubbles
