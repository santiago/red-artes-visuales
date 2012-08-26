jQuery.ready(function($) {
    var articulo = $('input[name=articulo]');

    var FormValidator= function($ctx, fields) {
	this.fields= fields;
	this.valid= false;
	this.$ctx= $ctx;
    };
    
    FormValidator.prototype.validate= function(opts) {
	var exclude= opts.exclude||[];
	var validators= {
	    'presence': function(val) {
		if(val == '' || !val) {
		    return false
		}
		return true
	    }
	};

	this.$ctx.find(".error").remove();
	var fields= this.fields;
	for(var f in fields) {
	    var val= this.$ctx.find(fields[f].find).val();
	    if(fields[f].validate && fields[f].validate.length) {
		for(var i in fields[f].validate) {
		    if(exclude.indexOf(f) > -1) {
			break;
		    }
		    var test= fields[f].validate[i];
		    if(!validators[test](val)) {
			this.$ctx.find(fields[f].find)
			.before("<p class='error'>* campo obligatorio</p>");
			return false;
		    }
		}
	    }
	    fields[f].data= val;
	}
	return true;
    }
    
    FormValidator.prototype.getValidData= function(opts) {
	var data;
	opts= opts||{};
	if(this.validate(opts)) {
	    data= {};
	    for(var f in this.fields) {
		data[f]= this.fields[f].data;
	    }
	}
	return data;
    };
    
    var TallerBaseForm= new FormValidator($("#newmap"),
	{
	    'nombre': {
		'find': 'input[name=name]',
		'validate': ['presence']
	    },
	    'descripcion': {
		'find': 'textarea[name=description]',
		'validate': ['presence']
	    }
	}
    );

    var TallerForm= new FormValidator($("#newmap"),
	{
	    'nombre': {
		'find': 'input[name=name]',
		'validate': ['presence']
	    },
	    'descripcion': {
		'find': 'textarea[name=description]',
		'validate': ['presence']
	    }
	}
    );

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

    var Consultas = function() {
	var $el = $('article#consultas');

	// Tabs
	$el.find('.opciones li a').click(function(e) {
	    e.preventDefault();
	    $(this).blur();
	    
	    var opcion = $(this).attr('id');

	    $el.find('.tab_content').hide();
	    $el.find('.tab_content#'+opcion).show();
	});
    };

    console.log('article');
})