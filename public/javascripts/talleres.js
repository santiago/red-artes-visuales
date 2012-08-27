jQuery(document).ready(function($) {
  $('.taller_item').click(function(e) {
    window.location = '/talleres/'+this.id; 
  });
  $('#agrega_part').click(function(e) {
    $.get('/consultas/participantes',function(e) {
      $('#agrega_participantes_dialog').show();
      $('.participantes_all')[0].innerHTML = e;
    });
  });
  $('#crea_nuevo_part').click(function(e) {
    window.location = '/participantes/new';  
  });
  $('#instancia_taller').click(function(e) {
    window.location = '/talleres/taller/new';
  });
});
