jQuery(document).ready(function($) { 
/*
  $('#agrega_part').click(function(e) {
    $.get('/consultas/participantes',function(e) {
      $('#agrega_participantes_dialog').show();
      $('.participantes_all')[0].innerHTML = e;
    });
  });
*/
  $('#tab-agregar').click(function(e) {
    window.location = '/participantes/new/equip/'+$('#equipamiento_id').val();  
/*
    var equip_id = $('#equipamiento_id').val();
    var url = "/consultas/participantes/equipamiento/"+ equip_id;
    $.get(url,function(e) {
      $('#agrega_participantes_dialog').show();
      $('.participantes_all')[0].innerHTML = e;
    });
*/
  });
    $('#tab-agregar').addClass('activo');
/*
  $('#crea_nuevo_part').click(function(e) {
  });
*/
  $('#instancia_taller').click(function(e) {
    window.location = '/talleres/taller/new';
  });

    $('.participante_item').click(function(e) {
	var path = window.location.pathname;
	var taller_id = path.substring(path.lastIndexOf('/') + 1); 
	var participante_id = '';
	window.location = '/evaluaciones/new?taller=' + id +'&p=' + this.id;
    });
});
