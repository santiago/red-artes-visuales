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
	Equipamientos: function() {
	},

	Talleres: function() {
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
	    var $el = $("#taller form");
	    $el.find('button').click(function(e) {
		e.preventDefault();

		var data= TallerBaseForm.getValidData();
		console.log(data);
		if (data) {
		    console.log(data);
		    // $.post('/equipamientos', data, res);
		}
	    });
	},

	FormParticipante: function() {
	}
    };

    Paginas[articulo]();
})