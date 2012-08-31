var Taller, TallerBase;

var filtros = {
    get: function(req, res, next) {
        var query = (function() {
            if (req.params.base_id) {
                return { _id: req.params.base_id }
            }
	    if (req.query) {
                return req.query
	    }
            return {};
        })();
        
        // Find by Id
        if (query._id) {
            TallerBase.findOne(query, function(err, r) {
                req.taller_base = r;
                next();
            });
        }
        // Find by All
        else {
            TallerBase.find(query, function(err, records) {
                req.talleres_base = records;
                next();
            });
        }
    },

    post: function(req, res, next) {
        var data = req.body;
        var model = new TallerBase(data);
        model.save(function(err, r) {
          if (err) {
            throw err;
          }
          req.taller = r;
          next();
        });
    },

    put: function(req, res, next) {
        var data = req.body;
        var id = req.params.base_id;
        Taller.update({ _id: id }, data, function(err, r) {
            if (err) {
                res.error = true;
            }
            next();
        });
    },

    del: function(req, res, next) {
        var id = req.params.base_id;
        Taller.findByIdAndRemove(id, function(err, r) {
            next();
        });
    },


    getParticipantes: function(req, res,next) {
      Evaluacion = app.db.model("Evaluacion");
      Participante = app.db.model("Participante");
      Participante.find({'equipamiento_id': req.taller.equipamiento_id}, function(err, participantes) {
        req.participantes = participantes;
        Evaluacion.find({'taller_id':req.taller._id}, function(err,evals) {
          var evaluaciones = new Array();
          for (var i=0;i<evals.length;i++) {
            evaluaciones[evals[i].participante_id] =   evals[i];
          } 
          req.evaluaciones = evaluaciones;
          next();
          });
      });
    },

    getSesion: function(req,res,next) {
      Taller.findById(req.params.taller_id, function(err, taller){
        req.participantes = participantes;
        req.taller = taller;
        next();
      });
    },
    getTaller: function(req, res, next) {
	    function findTallerBase(base_id) {
        TallerBase.findById(base_id, function(err, r) {
		    req.taller_base = r;
		    next();
      });
	}
	Taller.findById(req.params.taller_id, function(err, data) {
	    req.taller = data;
	    findTallerBase(data.actividad_id);
	});
    },

    getTalleres: function(req, res, next) {
	Taller.find({ actividad_id: req.params.base_id }, function(err, data) {
	    req.talleres = data;
	    next();
	});
    },

    postTaller: function(req, res, next) {
	    req.creativo = '71381688';
	    var fecha = parseInt(req.body.fecha);
      TallerBase.find({'_id':req.params.base_id},function(err, tallerbase) {
        if (err) {
          console.log(err);
          next();
        }
     	  var taller = new Taller({
          nombre : tallerbase.nombre,
	        actividad_id: req.params.base_id,
	        fecha: fecha,
	        creativos: [],
	        equipamiento_id:  req.body.equipamiento_id,
	        equipamiento_nombre:  req.body.equipamiento_nombre,
	        participantes:  [], 
	        resultados:  '', 
	        autoeval_creativo: '', 
	        observ_externas:  '', 
	        fotos:  [], 
	        videos:  []
	      });   
	    taller.creativos.push(req.creativo);

	    taller.save(function(err, record) {
	      req.taller = record;
	      next();
	    });
    });
  },

    addParticipante: function(req, res, next) {
	var taller = req.taller;
	var participantes = taller.participantes;
	
	participantes.push(req.body.participante);
	req.taller.update({ participantes: participantes }, function(err, record) {
	    console.log(err);
	    console.log(record);
	    next();
	});
    }
};

function Service(app) {
    Taller = app.db.model('Taller');
    TallerBase = app.db.model('TallerBase');
    
    var Equipamientos = require('./Equipamientos').filters;

    /*
     * JSON
     */
    app.get('/talleres.json', filtros.get, function(req, res) {
        res.send(req.talleres_base);
    });
    
    app.get('/talleres/:base_id.json', filtros.get, function(req, res) {
        res.send(req.taller_base);
    });
    
    // Crear un Taller desde un TallerBase
    app.post('/talleres/:base_id', filtros.postTaller, function(req, res) {
	res.send(req.taller);
    });

    app.post('/talleres/:taller_id/participantes', filtros.postParticipante, function(req, res) {
    });

    app.post('/talleres', filtros.post, function(req, res) {
        res.send(req.taller_base, 201);
    });

    app.put('/talleres/:base_id', filtros.put, function(req, res) {
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/talleres/:base_id', filtros.del, function(req, res) {
        res.send({ 'ok': true });
    });

    /*
     * HTML
     */
    app.get('/talleres', filtros.get, Equipamientos.get, function(req, res) {
	res.render('talleres', {
            locals: {
		talleres: [],
		talleres_base: req.talleres_base,
		articulo: 'Talleres'
            }
	});
    });

    app.get('/talleres/:base_id/new', filtros.get, Equipamientos.get, function(req, res) {
	res.render('forms/taller', {
            locals: {
		params: app.params,
		taller: req.taller_base,
		equipamientos: req.equipamientos,
		articulo: 'FormTaller'
            }
	});
    }); 

    app.get('/talleres/:base_id/talleres', filtros.getTalleres, function(req, res) {
	res.render('partials/lista_tallerbase_talleres', {
            locals: {
		talleres: req.talleres,
		base_id: req.params.base_id
            },
	    layout: false
	});
    }); 

    app.get('/consultas/talleres', filtros.get, function(req, res) {
	    res.render('partials/lista_talleres', {
            layout: false,
		locals: {
		    talleres: req.talleres_base,
		    articulo: 'Talleres'
		}
	    });
    });

    app.get('/talleres/new', function(req, res) {
	res.render('forms/taller_base', {
            locals: {
		params: app.params,
		articulo: 'FormTallerBase'
            }
	});
    });
    
    app.get('/talleres/:base_id/taller/:taller_id', filtros.get, filtros.getTaller, function(req, res) {
	res.render('taller', {
            locals: {
		params: app.params,
                taller: req.taller,
                taller_base: req.taller_base,
		articulo: 'Taller',
		participantes: []
            }
	});
    });

    app.get('/talleres/:base_id', filtros.get, function(req, res) {
        console.log("*******************");
        console.log(req.taller_base);
        res.render('taller_base', {
            locals: {
                articulo: 'TallerBase',
                taller_base: req.taller_base,
                params: app.params
            }
        });
    });

    // Debe recibir query con taller_id 
    app.get('/taller/:taller_id/participantes/new', filtros.getTaller, function(req, res) {
        res.render('forms/participante', {
            locals: {
		params: app.params,
                articulo: 'FormTallerParticipante',
                taller: req.taller,
                taller_base: req.taller_base
            }
        });
    });

    // Agregar un participante a un taller.
    // Si el participante no existe, lo crea
    app.post('/taller/:taller_id/participantes', filtros.getTaller, filtros.addParticipante, function(req, res) {
	res.send({ ok: 'ok' });
    });

    app.get('/taller/:taller_id', filtros.getSesion, filtros.getParticipantes, function(req, res) {
      
        res.render('taller', {
            locals: {
            		params: app.params,
                articulo: 'Taller',
                taller: req.taller,
                evaluaciones: req.evaluaciones,
                participantes: req.participantes 
            }
        });
    });
}

module.exports = Service;
