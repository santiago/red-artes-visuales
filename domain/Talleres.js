var Evaluacion, Participante, Taller, TallerBase, Asistencia, Creativo;
var getPeriodoQuery;

var filtros = {
	get: function(req, res, next) {
		var query = (function() {
			if (req.params.base_id) {
				return {
					_id: req.params.base_id
				}
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
		// Find All
		else {
			TallerBase.find(query).sort({
				nombre: 'asc'
			}).exec(function(err, records) {
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
				res.send(500);
			}
			req.taller = r;
			next();
		});
	},

	put: function(req, res, next) {
		var data = req.body;
		var id = req.params.taller_id;
		Taller.update({
			_id: id
		}, data, function(err, r) {
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

	getParticipantes: function(req, res, next) {
		Participante.find({
			'equipamiento_id': req.taller.equipamiento_id
		}, function(err, participantes) {
			req.participantes = participantes;
			next();
		});
	},

	getSesion: function(req, res, next) {
        function getCreativo(cedula) {
            Creativo.findOne({ cedula: cedula }, function(err, creativo) {
                req.creativo = creativo;
                next();
            });
        }
        
		Taller.findById(req.params.taller_id, function(err, taller) {
			req.taller = taller;
            req.params.equipamiento_id = taller.equipamiento_id;
            getCreativo(taller.creativo_cedula);
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
		Taller.find({
			actividad_id: req.params.base_id,
            fecha: getPeriodoQuery()
		}, function(err, data) {
			req.talleres = data;
			next();
		});
	},

	postTaller: function(req, res, next) {
		var fecha = parseInt(req.body.fecha);

		function save() {
			var taller = new Taller({
				nombre: req.taller_base.nombre,
				actividad_id: req.params.base_id,
				fecha: fecha,
				creativo_cedula: req.user.cedula,
				equipamiento_id: req.body.equipamiento_id,
				equipamiento_nombre: req.body.equipamiento_nombre,
				participantes: [],
				resultados: '',
				autoeval_creativo: '',
				observ_externas: '',
				fotos: [],
				videos: []
			});

			taller.save(function(err, record) {
				req.taller = record;
				next();
			});
		}

		TallerBase.findById(req.params.base_id, function(err, r) {
			req.taller_base = r;
			save();
		});
	},

	addParticipante: function(req, res, next) {
		var taller = req.taller;
		var participantes = taller.participantes;

		participantes.push(req.body.participante);
		req.taller.update({
			participantes: participantes
		}, function(err, record) {
			next();
		});
	},
    
    getAsistencia: function(req, res, next) {
        Asistencia.find({ taller_id: req.params.taller_id }, function(err, docs) {
            req.asistencia = {};
            req.observaciones = {};
            
            docs.forEach(function(doc) {
                req.asistencia[doc.participante_id] = doc.get('asistencia');
                req.observaciones[doc.participante_id] = doc.get('observaciones');
            });

            console.log('\n\n\n\n')
            console.log(req)

            next();
        });
    },
    
    postAsistencia: function(req, res, next) {
        var asistencia = req.body.asistencia;
        var observaciones = req.body.observaciones;

        // var Asistencia = app.db.model('Asistencia');
        
        var query = {
            participante_id: req.params.participante_id,
            taller_id: req.params.taller_id
        };
        
        Asistencia.findOne(query, function(err, r) {
            if(err) { 
                res.send(err, 500)
                return
            }
            
            if(!err && !r) {
                if(asistencia) query.asistencia = asistencia;
                if(observaciones) query.observaciones = observaciones;
                crearAsistencia(query);
            } else {
                if(asistencia) r.set('asistencia', asistencia);
                if(observaciones) r.set('observaciones', observaciones);
                r.save(next)
            }
        });

        function crearAsistencia(data) {
            data.creativo_cedula = req.user.cedula;
            var obj = new Asistencia(data)
            obj.save(function(err, r) {
                req.asistencia = r.toObject();
                next();
            });
        }
    }
};

function Service(app) {
	Evaluacion = app.db.model('Evaluacion');
	Participante = app.db.model('Participante');
	Taller = app.db.model('Taller');
	TallerBase = app.db.model('TallerBase');
    Asistencia = app.db.model('Asistencia');
    Creativo = app.db.model('Creativo');
    
    getPeriodoQuery = app.getPeriodoQuery;

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

	app.post('/talleres/:taller_id/participantes', filtros.postParticipante, function(req, res) {});
    
    app.post('/taller/:taller_id/participantes/:participante_id', filtros.postAsistencia, function(req, res) {
        res.send({ ok: true }, 200);
    });

	app.post('/talleres', filtros.post, function(req, res) {
		res.send(req.taller_base, 201);
	});

    app.post('/taller/:taller_id/consolida', function(req, res) {
        Taller.findById(req.params.taller_id, function(err, taller) {
            taller.set('consolidado', true)
            taller.save(function() {
                res.send({ ok: true })
            })
        })
    });

	app.put('/taller/:taller_id', filtros.put, function(req, res) {
		if (req.error) res.send({
			'error': true
		}, 500);
		else res.send({
			'ok': true
		});
	});

	app.del('/talleres/:base_id', filtros.del, function(req, res) {
		res.send({
			'ok': true
		});
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

	app.get('/talleres/:base_id', filtros.get, function(req, res) {
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
		res.send({
			ok: 'ok'
		});
	});

	app.get('/taller/:taller_id', filtros.getSesion, Equipamientos.get, filtros.getParticipantes, filtros.getAsistencia, function(req, res) {
		res.render('taller', {
			locals: {
				params: app.params,
				articulo: 'Taller',
				taller: req.taller,
                asistencia: req.asistencia,
				participantes: req.participantes,
                observaciones: req.observaciones,
                equipamiento: req.equipamiento,
                creativo: req.creativo
			}
		});
	});

    app.get('/taller/:taller_id/media', filtros.getSesion, Equipamientos.get, function(req, res) {
    	res.render('taller_media', {
			locals: {
                articulo: 'TallerMedia',
                taller: req.taller,
                equipamiento: req.equipamiento
			}
    	});
    })
    
    var upload = require('../lib/Upload')();
    app.post('/taller/:taller_id/media', upload, function(req, res) {
        res.send({ ok: true })
    });

	app.get('/taller/:taller_id/evaltaller', filtros.getSesion, Equipamientos.get, filtros.getParticipantes, function(req, res) {
		res.render('evaltaller', {
			locals: {
				params: app.params,
				articulo: 'FormEvalTaller',
				taller: req.taller,
				evaluaciones: req.evaluaciones,
				participantes: req.participantes,
                equipamiento: req.equipamiento
            }
		});
	});
}

module.exports = Service;