/*

  Pointerevents - Drag n' Drop
  v0.1.0

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
  function DD(el, settings) {
    this.el = el;
    this.$el = $(el);

    // settings
    this.settings = {};
    $.extend(this.settings, DD.prototype.settings, settings || {});

    // bind to self
    this.bind_to_self([
      "pointer_down_handler",
      "pointer_move_handler",
      "pointer_up_handler",
      "prevent_default"
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
      start_coordinates: false
    };
  };



  DD.prototype.start_drag = function(mouse_event) {
    this.state.dragging = true;
    this.show_drag_icon(mouse_event.pageX, mouse_event.pageY);
    $("body").addClass("dragging");
  };



  DD.prototype.stop_drag = function() {
    $("body").removeClass("dragging");
    this.hide_drag_icon();
    this.state.dragging = false;
  };



  //
  //  Events
  //
  DD.prototype.bind_events = function() {
    var events = [], i, j;

    events.push(["pointerdown", this.pointer_down_handler]);
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
  };


  DD.prototype.pointer_down_handler = function(e) {
    e.preventDefault();
    e = e.originalEvent;

    console.log(e);
    this.state.start_coordinates = { x: e.pageX, y: e.pageY };

    // document -> pointermove
    $(document).on("pointermove", this.pointer_move_handler);

    // remove pointermove on pointerup
    $(document).one("pointerup", this.pointer_up_handler);

    // cancel selection
    // this.cancel_selection();
  };


  DD.prototype.pointer_move_handler = function(e) {
    var start, now, diff;

    e.preventDefault();
    e = e.originalEvent;

    if (this.state.dragging) {
      this.move_drag_icon(e.pageX, e.pageY);

    } else {
      start = this.state.start_coordinates;
      now = { x: e.pageX, y: e.pageY };

      diff = Math.sqrt(
        Math.pow(now.x - start.x, 2) +
        Math.pow(now.y - start.y, 2)
      );

      if (diff >= 15) {
        this.start_drag(e);
      }

    }

    // cancel selection
    // this.cancel_selection();
  };


  DD.prototype.pointer_up_handler = function(e) {
    $(document).off("pointermove", this.pointer_move_handler);

    //
    console.log(e.target);

    // stop
    this.stop_drag();
  };


  DD.prototype.prevent_default = function(e) {
    e.preventDefault();
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


  DD.prototype.cancel_selection = function() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
  };



  //
  //  Export
  //
  window.PointerEventsDragnDrop = DD;


})(jQuery || Zepto);
