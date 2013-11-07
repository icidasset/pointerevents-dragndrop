$(function() {
  var draggable = $(".draggable");

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

  // dragenter
  $(".not-a-dropzone").on("pointerdragenter", function(e) {
    console.log("pointerdragenter");
  });

  // dragover
  $(".not-a-dropzone").on("pointerdragover", function(e) {
    console.log("pointerdragover");
  });

  // dragleave
  $(".not-a-dropzone").on("pointerdragleave", function(e) {
    console.log("pointerdragleave");
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
