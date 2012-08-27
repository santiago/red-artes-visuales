jQuery(document).ready(function($) {
  $('#buscar').click(function(e) {
    //when clicking buscar: get the active tab...
    var activo = $('.activo')[0].id;
    var filtros = new Array();
    //get all filter drop_downs and stick them into an array
    switch (activo) {
      case 'talleres':      
        //filtros = ['f_comunas_tall','f_creativos_tall','f_barrios_tall','f_metodos_tall', 'f_habilidades_tall','f_equipamientos_tall'];
        filtros = ['f_comunas_tall','f_barrios_tall','f_metodos_tall', 'f_habilidades_tall','f_equipamientos_tall'];
        break;
      case 'equipamientos': 
        //filtros = ['f_comunas_equip', 'f_barrios_equip', 'f_creativos_equip', 'f_tipos_equip', 'f_zonas_equip'];
        filtros = ['f_comunas_equip', 'f_barrios_equip', 'f_tipos_equip', 'f_zonas_equip'];
        break;
      case 'participantes': 
        filtros = ['f_edades_part', 'f_barrios_part','f_estratos_part', 'f_comunas_part'];
        break;
      default:
        filtros = [];
        break;
    }
    var query_string = "";
    //iterate over the array and construct the query_string 
    //with each name=value pair
    $.each(filtros, function() {
      var e = document.getElementsByName(this)[0];
      var valor_filtro = e.options[e.selectedIndex].value;
      if (valor_filtro == '') {
        return true;
      }
      var db_key = this.split("_");
      query_string += db_key[1].slice(0,-1) + '=' + valor_filtro + '&';
    });

    //cut the last &    
    query_string = query_string.slice(0, -1);
    //alert(query_string);
    //do the query
    $.get('/consultas/' + activo + '?' + query_string, function(e) {
      $($('.resultado_status')[0]).show();
      $('.resultado_status')[0].innerHTML = "Resultado de la búsqueda: ";
      $('.resultado')[0].innerHTML = e;
    });

  });
});
