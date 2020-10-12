$(document).ready(function () {

  var $checkboxes = $('input[type="checkbox"]');

  $checkboxes.change(function () {
    var countCheckedCheckboxes = $checkboxes.filter(':checked').length;
    var countCheckedCheckboxes2 = 17 + $checkboxes.filter(':checked').length;
    var isSingular = countCheckedCheckboxes === 1 || countCheckedCheckboxes2 === 1;
    $('#count-checked-checkboxes').text(`${countCheckedCheckboxes} apprentice${isSingular ? "" : "s"}`);
    $('#count-checked-checkboxes-2').text(`${countCheckedCheckboxes} apprentice${isSingular ? "" : "s"}`);
  });

});
