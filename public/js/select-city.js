function changeDO(DO, is_init) {
  $('#select-SI option:not(:eq(0))').hide();
  if (!DO) {
    return;
  }
  $('#select-SI option[data-do=' + DO + ']').show();
  if (!is_init) {
    $('#select-SI').val('');
  }
}
$(document).ready(function() {
  $('#select-DO').change(function(e) {
    changeDO(e.target.value);
  });
});
