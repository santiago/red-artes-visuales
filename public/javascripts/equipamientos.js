jQuery(document).ready(function($) {
  $('.equip_item').click(function(e) {
    window.location = '/equipamientos/'+ this.id;
  });
});
