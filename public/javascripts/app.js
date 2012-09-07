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
	
	for (var model in models) {
		Domain[model] = {
			find: function() {
				$.get(models[model].resource);
			},
			create: function(data, callback) {
				$.post(models[model].resource, data, callback);
			},
			remove: function() {},
			update: function() {}
		}
	}
};

// Modelos
var Equipamiento = Domain.Equipamiento;
var Taller = Domain.Taller;
var Participante = Domain.Participante;
// Páginas
var Paginas = {};

Paginas.TallerBase = function() {
	$('.list_header a.activo').each(function() {
		$(this).closest('li').css({
			'float': 'left'
		});
		$(this).find('span.mask').css({
			width: $(this).closest('li').width() - 2
		})
	});
};

Paginas.Taller = function() {
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
		$el.find('.tab_content#' + opcion).show();

		// $(this).closest('li').prepend($mask);
		// $mask.css({ width: $(this).closest('li').width() });
	});

	$el.find('.submit').click(function(e) {
		e.preventDefault();
		$(this).blur();
		var taller_id = location.pathname.split('/').pop();
		location.href = '/taller/' + taller_id + '/participantes/new';
	});
};

Paginas.Equipamientos = function() {};

Paginas.EquipamientoTalleres = function() {
	var $el = $('article#equipamiento');

	$('#fecha').datepicker();

	$el.find('.submit').click(function(e) {
    if ($('#fecha').hasClass('border_error')) {
      $('#fecha').removeClass('border_error');
    }
		e.preventDefault();
		$(this).blur();

		var equip = location.pathname.split('/')[2];
		var taller_id = $('select option:selected').val();
		var fecha_str = $('#fecha').val();
    if (fecha_str) {
		  var fecha = fecha_str.split('/');
		  if (fecha) {
			  fecha = new Date(parseInt(fecha[2]), parseInt(fecha[0].replace(/^0/, '')) - 1, parseInt(fecha[1].replace(/^0/, '')))
			  fecha = fecha.getTime();
		  }
    } 

		if (!equip) {
			$(this).parent().before("<p class='error'>* debe seleccionar un equipamiento</p>");
		}

		if (!fecha) {
			$(this).parent().before("<p class='error'>* debe seleccionar una fecha</p>");
      $('#fecha').addClass('border_error');
		}

		if (fecha && taller_id) {
			var equip_nombre = $('select option:selected').first().text();
			$.post('/talleres/' + taller_id, {
				equipamiento_id: equip,
				fecha: fecha,
				equipamiento_nombre: equip_nombre
			}, function(taller) {
				location.href = '/equipamientos/' + equip;
			});
		}
	});
};

Paginas.Talleres = function() {
	var $el = $('article#talleres');

	$el.find('.ver-equipamientos').click(function(e) {
		e.preventDefault();
		$(this).blur();

		$(this).closest('.taller_item').find('.equipamientosTaller').first().slideDown('fast');

		$(this).hide();
		$(this).closest('.taller_item').find('.cerrar-equipamientos').show()

		var taller_base = $(this).closest('.taller_item').attr('id');
		$(this).closest('.taller_item').find('.equipamientosTaller').load('/talleres/' + taller_base + '/talleres');
	});

	$el.find('.cerrar-equipamientos').click(function(e) {
		e.preventDefault();
		$(this).blur();

		$(this).closest('.taller_item').find('.equipamientosTaller').first().slideUp('fast');

		$(this).hide();
		$(this).closest('.taller_item').find('.ver-equipamientos').show();
	});

	$("button.submit").live('click', function(e) {
		e.preventDefault();
		$(this).blur();
		var id = $(this).closest('.taller_item').attr('id');
		location.href = '/talleres/' + id + '/new';
	});
};

Paginas.Consultas = function() {
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
		$el.find('.tab_content#' + opcion).show();

		$(this).closest('li').prepend($mask);
		$mask.css({
			width: $(this).closest('li').width()
		});
	});
};

Paginas.FormEquipamiento = function() {
	// Callback par atender el response
	function res(data) {
		console.log(data);
		location.href = '/equipamientos';
	}

	// Collect and Validate data
	var $el = $("#equipamiento form");
	$el.find('button').click(function(e) {
		e.preventDefault();

		var data = EquipamientoForm.getValidData();
		if (data) {
			$.post('/equipamientos', data, res);
		}
	});
};

Paginas.FormTaller = function() {};

Paginas.FormTallerBase = function() {
	// Callback par atender el response

	function res(data) {
		console.log(data);
		location.href = "/talleres";
	}

	var $el = $("#taller form");
	$el.find('button').click(function(e) {
		e.preventDefault();
		var data = TallerBaseForm.getValidData();
		if (data) {
			$.post('/talleres', data, res);
		}
	});
};

Paginas.EditarEquipamiento = function() {
	$('input[type="radio"]').removeAttr('disabled');
};
	
Paginas.EditarCreativo = function() {
	fixMask();
	
	function res(data) {
		location.href = location.pathname;
	}

	var $el = $('#creativo form');
	$el.find('button').click(function(e) {
		e.preventDefault();
		var data = AdminCreativoForm.getValidData();
		if (data) {
			$.ajax({
				url: location.pathname,
				type: 'PUT',
				data: data, 
				success: res
			});
		}
	});
};

Paginas.FormCreativo = function() {
	fixMask();

	function res(data) {
		console.log(data);
		location.href = "/admin/creativos";
	}
	var $el = $('#creativo form');
	$el.find('button').click(function(e) {
		e.preventDefault();
		var data = AdminCreativoForm.getValidData();
		if (data) {
			$.post('/admin/creativos', data, res);
		}
	});
};

Paginas.EditarParticipante = function() {
  var $el = $('#edit_participante');
	var participante_id = $('#participante_id').val();
  $el.find('button.submit').click(function(e) {
    e.preventDefault();
    var data = EditarParticipanteForm.getValidData();
    if (data) {
			$.ajax({
				url: '/participantes/' + participante_id,
				type: 'PUT',
				data: data,
				success: function(data) {
					console.log(data);
					location.href = "/participantes/" + participante_id;
				}
			});
		}
	});
};

Paginas.FormEvalTaller = function() {
	var $el = $('#taller form');
	$el.find('button.submit').click(function(e) {
		var taller_id = $('#taller_id').val();
		e.preventDefault();
		var data = EvalTallerForm.getValidData();
		if (data) {
			$.ajax({
				url: '/taller/' + taller_id,
				type: 'PUT',
				data: data,
				success: function(data) {
					console.log(data);
					location.href = "/taller/" + taller_id;
				}
			});
		}
	});
};

Paginas.FormParticipante = function() {
	var $el = $('#participante form');
	var equip_id = $('#equipamiento_id').val();

	$el.find('button.submit').click(function(e) {
		e.preventDefault();
		var parti = ParticipanteForm.getValidData();
		if (parti) {
			console.log(parti);
			$.post('/participantes', parti, function(data) {
				location.href = '/equipamientos/' + equip_id + "/participantes";
			});
		}
	});
};


Paginas.FormEvaluacion = function() {
	var $el = $('#evaluacion');
	var taller_id = $('#taller_id').val();

	$el.find('.list_header a.activo').each(function() {
		$(this).find('span.mask').css({
			width: $(this).parent().width() - 2
		})
	});

	$el.find('button.submit').click(function(e) {
		e.preventDefault();
		var eval = EvaluacionForm.getValidData();
		if (eval) {
			eval.taller_id = taller_id;
			eval.creativo_id = $('#creativo_id').val();
			eval.fecha = $('#fecha').val();
			eval.p_id = $('#p_id').val();
			console.log(eval);
			$.post('/evaluaciones', eval, function(data) {
				location.href = "/taller/" + taller_id;
			});
		}
	});
};

Paginas.FormTallerParticipante = function() {
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
};

// Util functions
var fixMask = function() {
	$('.list_header a.activo').each(function() {
		$(this).find('span.mask').css({
			width: $(this).closest('li').width()
		})
	});
}

try {
	Paginas[articulo]();
}
catch (err) {}


}) // endonready
