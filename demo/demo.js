$(function() {
  var draggable = document.querySelectorAll(".draggable");

  // alternative:
  //
  // var p = new PointerEventsDragnDrop(
  //   document.body, {
  //     delegate_selector: ".draggable"
  //   }
  // );

  var p = new PointerEventsDragnDrop(draggable);

  // dragstart
  $(".draggable").on("pointerdragstart", function(e) {
    console.log("pointerdragstart", e);
  });

  // dragend
  $(".draggable").on("pointerdragend", function(e) {
    console.log("pointerdragend", e);
  });

  // drop
  $(".dropzone").on("pointerdrop", function(e) {
    alert("Dropped it.");
  });
});
