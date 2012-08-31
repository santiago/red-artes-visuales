jQuery(document).ready(function($) {
    var articulo = $('input[name=articulo]').val();

    var Domain = function() {
	var models = {
	    Equipamiento: {
		resource: '/equipamientos'
	    },
	    Taller: {
		resource: '/talleres'
	    },
	    Participante: {
		resource: '/participante'
	    }
	};

	for(var model in models) {
	    Domain[model] = {
		find: function() {
		    $.get(models[model].resource);
		},
		create: function(data, callback) {
		    $.post(models[model].resource, data, callback);
		},
		remove: function() {
		},
		update: function() {
		}
	    }
	}
    };

    // Modelos
    var Equipamiento = Domain.Equipamiento;
    var Taller = Domain.Taller;
    var Participante = Domain.Participante;

    // Páginas
    var Paginas = {
	Actividad: function() {
	},

	TallerBase: function() {
	},

	Taller: function() {
	    var $el = $("#taller");
	    // Tabs
	    $el.find('.opciones li a').click(function(e) {
		e.preventDefault();
		$(this).blur();
		
		var opcion = $(this).attr('id');
		
		// Active Tab
		$el.find('.opciones li a').removeClass('activo');
		$(this).addClass('activo');
		
		// Show/Hide content
		$el.find('.tab_content').hide();
		$el.find('.tab_content#'+opcion).show();
		
		// $(this).closest('li').prepend($mask);
		// $mask.css({ width: $(this).closest('li').width() });
	    });

	    $el.find('.submit').click(function(e) {
		e.preventDefault();
		$(this).blur();
		var taller_id = location.pathname.split('/').pop();
		location.href = '/taller/'+taller_id+'/participantes/new';
	    });
	},

	Equipamientos: function() {
	},

	EquipamientoTalleres: function() {
	    var $el = $('article#equipamiento');
	    
	    $('#fecha').datepicker();

	    $el.find('.submit').click(function(e) {
		e.preventDefault();
		$(this).blur();

		var equip = location.pathname.split('/')[2];
		var taller_id = $('select option:selected').first().text();
		var fecha = $('#fecha').val().split('/');
		if (fecha) {
		    fecha = new Date(parseInt(fecha[2]),
				     parseInt(fecha[0].replace(/^0/,''))-1,
				     parseInt(fecha[1].replace(/^0/,'')))
		    fecha = fecha.getTime();
		}

		if(!equip) {
		    $(this).parent().before("<p class='error'>* debe seleccionar un equipamiento</p>");
		}

		if(!fecha) {
		    $(this).parent().before("<p class='error'>* debe seleccionar una fecha</p>");
		}

		if(fecha && taller_id) {
		    var equip_nombre = $('select option:selected').first().text();
		    $.post('/talleres/'+taller_id, { equipamiento_id: equip, fecha: fecha, equipamiento_nombre: equip_nombre }, function(taller) {
			location.href= '/equipamientos/'+equip;
		    });
		}
	    });
	},

	Talleres: function() {
	    var $el = $('article#talleres');

	    $el.find('.ver-equipamientos').click(function(e) {
		e.preventDefault();
		$(this).blur();

		$(this).closest('.taller_item')
		    .find('.equipamientosTaller')
  		    .first()
                    .slideDown('fast');

		$(this).hide();
		$(this).closest('.taller_item')
		    .find('.cerrar-equipamientos')
		    .show()

		var taller_base = $(this).closest('.taller_item').attr('id');
		$(this).closest('.taller_item')
		    .find('.equipamientosTaller').load('/talleres/'+taller_base+'/talleres');
	    });

	    $el.find('.cerrar-equipamientos').click(function(e) {
		e.preventDefault();
		$(this).blur();

		$(this).closest('.taller_item')
		    .find('.equipamientosTaller')
  		    .first()
                    .slideUp('fast');

		$(this).hide();
		$(this).closest('.taller_item')
		    .find('.ver-equipamientos')
		    .show();
	    });

	    $("button.submit").live('click', function(e) {
		e.preventDefault();
		$(this).blur();
		var id = $(this).closest('.taller_item').attr('id');
		location.href = '/talleres/'+id+'/new';
	    });
	},

	Consultas: function() {
	    var $el = $('article#consultas');
	    var $mask = $el.find('.opciones .mask');

	    // Tabs
	    $el.find('.opciones li a').click(function(e) {
		e.preventDefault();
		$(this).blur();
		
		var opcion = $(this).attr('id');

		// Active Tab
		$el.find('.opciones li a').removeClass('activo');
		$(this).addClass('activo');

		// Show/Hide content
		$el.find('.tab_content').hide();
		$el.find('.tab_content#'+opcion).show();

		$(this).closest('li').prepend($mask);
		$mask.css({ width: $(this).closest('li').width() });
	    });
	},

	FormEquipamiento: function() {
	    // Callback par atender el response
	    function res(data) {
		console.log(data);
	    }

	    // Collect and Validate data
	    var $el = $("#equipamiento form");
	    $el.find('button').click(function(e) {
		e.preventDefault();

		var data= EquipamientoForm.getValidData();
		if (data) {
		    $.post('/equipamientos', data, res);
		}
	    });
	},

	FormTaller: function() {
	},

	FormTallerBase: function() {
	    // Callback par atender el response
	    function res(data) {
		console.log(data);
	    }

	    var $el = $("#taller form");
	    $el.find('button').click(function(e) {
		e.preventDefault();
		var data= TallerBaseForm.getValidData();
		if (data) {
		    $.post('/talleres', data, res);
		}
	    });
	},

	FormCreativo: function() {
	    function res(data) {
		console.log(data);
	    }
	    var $el = $('#creativo form');
	    $el.find('button').click(function(e) {
		e.preventDefault();
		var data = AdminCreativoForm.getValidData();
		if (data) {
		    $.post('/admin/creativos', data, res);
		}
	    });  
	},

	FormParticipante: function() {
    var $el = $('#participante form');
    var equip_id=$('#equipamiento_id').val();
 
    $el.find('button.submit').click(function(e) {
      e.preventDefault();
      var parti = ParticipanteForm.getValidData();
      if (parti) {
          console.log(parti);
           $.post('/participantes', parti, function(data) {
            location.href = '/equipamientos/'+equip_id+"/participantes";
           });
      }
    });
 
	},

	FormTallerParticipante: function() {
  /*
	    var $el = $('#participante');
	    var taller_id = location.pathname.split('/')[2];

	    $el.find('button.submit').click(function(e) {
		e.preventDefault();
		var parti = ParticipanteForm.getValidData();
		if (parti) {
		    console.log(parti);
		    // $.post('/taller/'+taller_id+'/participantes', parti, function(data) {
		    // 	location.href = '/taller/'+taller_id;
		    // });
		}
	    });
*/
	}
    };
    try {
      Paginas[articulo]();
    } catch (err) {
    }
})


