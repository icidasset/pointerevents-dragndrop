/*

  Pointerevents - Drag n' Drop
  v0.1.1

*/

(function($) {

  "use strict";

  var __bind = function(fn, me) {
    return function() { return fn.apply(me, arguments); };
  };



  //
  //  Default settings
  //
  DD.prototype.settings = {
    delegate_selector: false,
    drag_icon_classname: "drag-icon"
  };



  //
  //  Constructor
  //
  function DD(element, settings) {
    this.$el = (function() {
      if (element instanceof $) {
        return element;
      } else if ($.isArray(element)) {
        return element;
      } else {
        return $(element);
      }
    })();

    // settings
    this.settings = {};
    $.extend(this.settings, DD.prototype.settings, settings || {});

    // bind to self
    this.bind_to_self([
      "pointer_down_handler",
      "pointer_move_handler",
      "pointer_up_handler",
      "touch_start_handler",
      "prevent_default",
      "document_pointerout_handler"
    ]);

    // setup
    this.set_initial_state_object();
    this.bind_events();
  }



  //
  //  State
  //
  DD.prototype.set_initial_state_object = function() {
    this.state = {
      dragging: false,
      dragging_origin: false,
      start_coordinates: false,
      last_toElement: false,
      pointers: {},
      amount_of_touches: 0
    };
  };


  DD.prototype.reset_state = function() {
    this.state.dragging = false;
    this.state.dragging_origin = false;
    this.state.last_toElement = false;
    this.state.amount_of_touches = 0;
  };


  DD.prototype.start_drag = function(pointer_event) {
    this.state.dragging = true;
    this.show_drag_icon(pointer_event.pageX, pointer_event.pageY);

    $(this.state.dragging_origin).trigger("pointerdragstart");
    $("body").addClass("dragging");
  };


  DD.prototype.stop_drag = function(pointer_event) {
    this.unbind_move_and_up_handler();

    $("body").removeClass("dragging");
    $(this.state.dragging_origin).trigger("pointerdragend");

    this.hide_drag_icon();
    this.reset_state();
  };



  //
  //  Events / General
  //
  DD.prototype.bind_events = function() {
    var events = [], i, j;

    events.push(["pointerdown", this.pointer_down_handler]);
    events.push(["touchstart", this.touch_start_handler]);

    events.push(["dragstart", this.prevent_default]);
    events.push(["drop", this.prevent_default]);
    events.push(["mousedown", this.prevent_default]);

    // the end
    j = events.length;

    // delegate?
    if (this.settings.delegate_selector) {
      for (i=0; i<j; ++i) {
        events[i].splice(1, 0, this.settings.delegate_selector);
      }
    }

    // bind
    for (i=0; i<j; ++i) {
      this.$el.on.apply(this.$el, events[i]);
    }

    // special events
    $(document).on("pointerout", this.document_pointerout_handler);
  };


  DD.prototype.unbind_move_and_up_handler = function() {
    var $doc = $(document);
    $doc.off("pointermove", this.pointer_move_handler);
    $doc.off("pointerup", this.pointer_up_handler);
  };



  //
  //  Events / Pointer events
  //
  DD.prototype.pointer_down_handler = function(e) {
    var $doc = $(document);

    // where it all started
    this.state.dragging_origin = e.currentTarget;

    e.preventDefault();
    e = e.originalEvent || e;

    // state
    this.state.start_coordinates = {
      x: e.pageX,
      y: e.pageY
    };

    this.state.pointers[e.pointerId.toString()] = {
      pointerType: e.pointerType,
      pointerId: e.pointerId
    };

    // document -> pointermove
    $doc.on("pointermove", this.pointer_move_handler);

    // stop everything on pointerup
    $doc.one("pointerup", this.pointer_up_handler);
  };


  DD.prototype.pointer_move_handler = function(e) {
    var start, now, diff;

    e.preventDefault();
    e = e.originalEvent || e;

    if (this.state.dragging) {
      this.move_drag_icon(e.pageX, e.pageY);
      this.trigger_additional_drag_events(e);

    } else {
      start = this.state.start_coordinates;
      now = { x: e.pageX, y: e.pageY };

      diff = Math.sqrt(
        Math.pow(now.x - start.x, 2) +
        Math.pow(now.y - start.y, 2)
      );

      if (diff >= 15 && this.state.amount_of_touches < 2) {
        this.start_drag(e);
      }

    }
  };


  DD.prototype.pointer_up_handler = function(e) {
    e.preventDefault();
    e = e.originalEvent || e;

    delete this.state.pointers[e.pointerId.toString()];

    // trigger drop event
    // and stop dragging if needed
    if (this.state.dragging) {
      $(e.target).trigger("pointerdrop");
      this.stop_drag(e);

    // otherwise,
    // do a reset
    } else {
      this.unbind_move_and_up_handler();
      this.reset_state();

    }
  };



  //
  //  Events / Touch events
  //
  DD.prototype.touch_start_handler = function(e) {
    e = e.originalEvent || e;
    this.state.amount_of_touches = e.touches.length;
  };



  //
  //  Events / Other
  //
  DD.prototype.prevent_default = function(e) {
    e.preventDefault();
  };


  DD.prototype.trigger_additional_drag_events = function(e) {
    var last_toElement_is_node = (
      this.state.last_toElement &&
      this.state.last_toElement.nodeType
    );

    if (last_toElement_is_node && (this.state.last_toElement !== e.toElement)) {
      $(this.state.last_toElement).trigger("pointerdragleave");
      $(e.target).trigger("pointerdragenter");

    } else if (last_toElement_is_node && (this.state.last_toElement === e.toElement)) {
      $(this.state.last_toElement).trigger("pointerdragover");

    } else {
      $(e.target).trigger("pointerdragenter");

    }

    this.state.last_toElement = e.target;
  };


  DD.prototype.document_pointerout_handler = function(e) {
    e = e.originalEvent || e;

    if (e.relatedTarget === null || e.relatedTarget.tagName.toLowerCase() === "html") {
      this.stop_drag();
    }
  };



  //
  //  Drag icon
  //
  DD.prototype.show_drag_icon = function(x, y) {
    var element;

    if (!this.state.drag_icon_element) {
      element = document.createElement("div");
      element.className = this.settings.drag_icon_classname;
      element.innerHTML = "";
      $(element).css("position", "absolute");
      document.body.appendChild(element);
      this.state.drag_icon_element = element;
    } else {
      element = this.state.drag_icon_element;
    }

    $(element).show(0);
    this.move_drag_icon(x, y);
  };


  DD.prototype.hide_drag_icon = function() {
    $(this.state.drag_icon_element).hide(0);
  };


  DD.prototype.move_drag_icon = function(x, y) {
    var $el = $(this.state.drag_icon_element);
    $el.css({ left: x - ($el.width() / 2), top: y - ($el.height() / 2) });
  };



  //
  //  Utilities
  //
  DD.prototype.bind_to_self = function(methods) {
    for (var i=0,j=methods.length; i<j; ++i) {
      this[methods[i]] = __bind(this[methods[i]], this);
    }
  };



  //
  //  Export
  //
  window.PointerEventsDragnDrop = DD;


})(window.jQuery || window.Zepto);
