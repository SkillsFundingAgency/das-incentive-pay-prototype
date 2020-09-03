$(document).ready(function(){

  var $checkboxes = $('input[type="checkbox"]');

  $checkboxes.change(function(){
    var countCheckedCheckboxes = $checkboxes.filter(':checked').length;
    var countCheckedCheckboxes2 = 17 + $checkboxes.filter(':checked').length;
    $('#count-checked-checkboxes').text(countCheckedCheckboxes);
    $('#count-checked-checkboxes-2').text(countCheckedCheckboxes2);
  });

});
