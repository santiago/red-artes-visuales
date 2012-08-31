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
	var taller_id = location.pathname.split('/')[2]; 
	var participante_id = $(this).attr('id');
	window.location = '/taller/'+taller_id+'/participante/'+participante_id+'/evaluacion';
    });
});
