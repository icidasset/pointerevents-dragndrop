$(function() {
  var p = new PointerEventsDragnDrop(
    document.body, {
      delegate_selector: ".draggable"
    }
  );

  $(".dropzone").on("pointerdrop", function(e) {
    alert("Dropped it.");
  });
});
