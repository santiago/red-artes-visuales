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
	var val= this.$ctx.find(fields[f].find).val() || '';
	if(fields[f].validate && fields[f].validate.length) {
	    for(var i in fields[f].validate) {
		if(exclude.indexOf(f) > -1) {
		    break;
		}

		var test= fields[f].validate[i];
		if(!validators[test](val)) {
		    var lookup = $.trim(fields[f].find.replace(/option:selected|:checked/, ''));
		    this.$ctx.find(lookup).first().before("<p class='error'>* campo obligatorio</p>");
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

var TallerBaseForm= new FormValidator($("#taller form"),
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

var EquipamientoForm = new FormValidator(
    $("#equipamiento form"),
    {
	'nombre': {
	    'find': 'input[name=nombre]',
	    'validate': ['presence']
	},
	'ubicacion': {
	    'find': 'input[name=ubicacion]',
	    'validate': ['presence']
	},
	'comuna': {
	    'find': 'select[name=comuna]',
	    'validate': ['presence']
	},
	'barrio': {
	    'find': 'select[name=barrio]',
	    'validate': ['presence']
	},
	'contacto': {
	    'find': 'input[name=contacto]',
	    'validate': ['presence']
	},
	'email': {
	    'find': 'input[name=email]',
	    'validate': ['presence']
	},
	'telefono': {
	    'find': 'input[name=telefono]',
	    'validate': ['presence']
	},
	'experiencia': {
	    'find': 'input[name=experiencia]:checked',
	    'validate': ['presence']
	},
	'otros_talleres': {
	    'find': 'select[name=otros_talleres] option:selected',
	    'validate': ['presence']
	},
	'tipo': {
	    'find': 'select[name=tipo] option:selected',
	    'validate': ['presence']
	},
	'espacios': {
	    'find': 'select[name=espacios] option:selected',
	    'validate': ['presence']
	},
	'locker': {
	    'find': 'input[name=locker]:checked',
	    'validate': ['presence']
	},
	'banos': {
	    'find': 'input[name=banos]:checked',
	    'validate': ['presence']
	},
	'e_equipos': {
	    'find': 'input[name=e_equipos]',
	    'validate': ['presence']
	},
	'horario': {
	    'find': 'input[name=horario]',
	    'validate': ['presence']
	},
	'edades': {
	    'find': 'select[name=edades] option:selected',
	    'validate': ['presence']
	},
	'seguridad': {
	    'find': 'input[name=seguridad]:checked',
	    'validate': ['presence']
	},
	'fronteras': {
	    'find': 'input[name=fronteras]:checked',
	    'validate': ['presence']
	},
	'zona': {
	    'find': 'input[name=zona]:checked',
	    'validate': ['presence']
	},
	'como_llegar': {
	    'find': 'textarea[name=como_llegar]',
	    'validate': ['presence']
	},
	'web': {
	    'find': 'input[name=web]',
	    'validate': ['presence']
	},
	'fb': {
	    'find': 'input[name=fb]',
	    'validate': ['presence']
	},
	'twitter': {
	    'find': 'input[name=twitter]',
	    'validate': ['presence']
	},
	'blog': {
	    'find': 'input[name=blog]',
	    'validate': ['presence']
	},
	'newsletter': {
	    'find': 'input[name=newsletter]:checked',
	    'validate': ['presence']
	},
	'cartelera': {
	    'find': 'input[name=cartelera]:checked',
	    'validate': ['presence']
	},
	'telefono_info': {
	    'find': 'input[name=telefono_info]:checked',
	    'validate': ['presence']
	},
	'perifonia': {
	    'find': 'input[name=perifonia]:checked',
	    'validate': ['presence']
	},
	'boletin': {
	    'find': 'input[name=boletin]:checked',
	    'validate': ['presence']
	},
	'medios_comun': {
	    'find': 'input[name=medios_comun]:checked',
	    'validate': ['presence']
	},
	'emailing': {
	    'find': 'input[name=emailing]:checked',
	    'validate': ['presence']
	}
    }
);