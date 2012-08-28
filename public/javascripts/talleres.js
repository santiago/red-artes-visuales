jQuery(document).ready(function($) {
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
  $('.participante_item').click(function(e) {
    var path = window.location.pathname;
    var id = path.substring(path.lastIndexOf('/') + 1); 
    window.location = '/evaluaciones/new?taller=' + id +'&p=' + this.id;
  });
});
