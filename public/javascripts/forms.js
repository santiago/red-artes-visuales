var FormValidator= function($ctx, fields) {
    this.fields= fields;
    this.valid= false;
    this.$ctx= $ctx;
};

FormValidator.prototype.validate= function(opts) {
    var self = this;
    var exclude= opts.exclude||[];
    var validators= {
	'presence': function(val) {
	    if(val == '' || !val) {
		return false
	    }
	    return true
	},
	'email': function(val) {
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    if(val.match(re)) {
        return true
	    }
	    return false
	}
    };
    
    this.$ctx.find(".error").remove();
    var fields= this.fields;
    for(var f in fields) {
	var val= (function() {
	    if (typeof fields[f].val == 'function')
		return fields[f].val();
	    else
		return self.$ctx.find(fields[f].find).val() || '';
	})();

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

var LoginForm = new FormValidator($("article#login form"), {
  'email': {
    'find': 'input[name=email]',
    'validate': ['presence','email']
  },
  'contrasena': {
    'find': 'input[name=contrasena]',
    'validate': ['presence']
  }
});


var AdminCreativoForm = new FormValidator($("article#creativo form"), {
    'nombre' : {
      'find': 'input[name=nombre]',
      'validate': ['presence']
    },
    'email' : {
      'find': 'input[name=email]',
      'validate': ['presence','email']
    },
    'telefono': {
      'find': 'input[name=telefono]',
      'validate': ['presence']
    },
    'cedula': {
      'find': 'input[name=cedula]',
      'validate': ['presence']
    },
    'titulo': {
      'find': 'input[name=titulo]',
      'validate': ['presence']
    },
    'direccion': {
      'find': 'textarea[name=desc]',
      'validate': ['presence']
    } 
});

var habilidades = ['Reflexión', 'Creatividad', 'Capacidad de escucha', 'Compromiso',
      'Pensamiento critico', 'Tolerancia', 'Honestidad', 'Participación',
      'Reconocer el contexto social', 'Reconocer el contexto familiar',
      'Reconocer el context geográfico', 'Respeto', 'Confianza',
      'Construcción colectiva', 'Aceptación del otro',
      'Capacidad de expresión', 'Trabajo en equipo'];



var fields = new Array();
for (var i=0;i<habilidades.length;i++) {
    var input_name = "input[name='i_" + habilidades[i] + "']:checked";
    var field_name = "i_" + habilidades[i];
    fields[field_name] = {
      'find': input_name,
      'validate': ['presence']
     }
}
var EvaluacionForm = new FormValidator($("article#evaluacion form"),fields);
  

var TallerBaseForm= new FormValidator($("article#taller form"),
	{
	  'nombre': {
		  'find': 'input[name=nombre]',
		  'validate': ['presence']
	  },
	  'descripcion': {
		  'find': 'textarea[name=descripcion]',
		  'validate': ['presence']
	  },
	  'objetivos': {
		  'find': 'textarea[name=objetivos]',
		  'validate': ['presence']
	  },
	  'metodologias': {
		  'find': '[name="metodologias[]"]',
		  'val': function() {
		    var data = [];
		    $('[name="metodologias[]"]:checked').each(function() {
			    data.push($(this).val());
		    });
		    return data;
		  },
        'validate': ['presence']
	  },
	  'habilidades': {
		  'find': '[name="habilidades[]"]',
		  'val': function() {
		    var data = [];
		    $('[name="habilidades[]"]:checked').each(function() {
			    data.push($(this).val());
		    });
		    return data;
		  },
		    'validate': ['presence']
	  }
	}
    );

var ParticipanteForm = new FormValidator(
   $("#participante form"),
    {
	'nombre': {
	    'find': 'input[name=nombre]',
	    'validate': ['presence']
	},

	'edad': {
	    'find': 'select[name=edad] option:selected',
	    'validate': ['presence','fecha']
	},

	'comuna': {
	    'find': 'select[name=comuna] option:selected',
	    'validate': ['presence']
	},

	'barrio': {
	    'find': 'select[name=barrio] option:selected',
	    'validate': ['presence']
	},

	'estrato': {
	    'find': 'select[name=estrato] option:selected',
	    'validate': ['presence']
	},

	'contacto': {
	    'find': 'input[name=contacto]',
	    'validate': ['presence']
	},

	'situacion': {
	    'find': 'select[name=situacion] option:selected',
	    'validate': ['presence']
	},

	'poblacion': {
	    'find': 'select[name=poblacion] option:selected',
	    'validate': ['presence']
	},

	'padres': {
	    'find': 'select[name=padres] option:selected',
	    'validate': ['presence']
	},

	'observaciones': {
	    'find': 'textarea[name=observaciones]',
	    'validate': ['presence']
	},
  'equipamiento_id': {
      'find': 'input[name=equip_id]',
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
	    'find': '[name="otros[]"]',
	    'val': function() {
		var data = [];
		$('[name="otros[]"]:checked').each(function() {
		    data.push($(this).val());
		});
		return data;
	    },
	    'validate': ['presence']
	},
	'tipo': {
	    'find': 'select[name=tipo] option:selected',
	    'validate': ['presence']
	},
	'espacios': {
	    'find': '[name="espacios[]"]',
	    'val': function() {
		var data = [];
		$('[name="espacios[]"]:checked').each(function() {
		    data.push($(this).val());
		});
		return data;
	    },
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
	    'find': '[name="edades[]"]',
	    'val': function() {
		var data = [];
		$('[name="edades[]"]:checked').each(function() {
		    data.push($(this).val());
		});
		return data;
	    },
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
	'medios_comunit': {
	    'find': 'input[name=medios_comunit]:checked',
	    'validate': ['presence']
	},
	'emailing': {
	    'find': 'input[name=emailing]:checked',
	    'validate': ['presence']
	}
    }
);
