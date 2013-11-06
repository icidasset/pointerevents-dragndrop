# Pointerevents Drag n' Drop

Drag and drop for pointerevents.

## Dependencies

- A polyfill for pointerevents (I used [the Polymer one](https://github.com/Polymer/PointerEvents))
- jQuery or Zepto

## Events

- pointerdragstart
- pointerdragend
- pointerdrop

## How to use

```javascript
var instance = new PointerEventsDragnDrop(element_or_nodelist, options);
```

## Settings

```javascript
// with defaults
delegate_selector = false;
drag_icon_classname = "drag-icon";
```

## To do

- Remove jQuery/Zepto dependency
- pointerdragenter
- pointerdragleave
- pointerdragover
