function Service(app) {
	var Evaluacion = app.db.model('Evaluacion');
	var Taller = app.db.model('Taller');
	var TallerBase = app.db.model('TallerBase');
	var Participante = app.db.model('Participante');
	var Creativo = app.db.model('Creativo');

	function getEvaluaciones(req, res, next) {
		var query = (function() {
			if (req.params.id) {
				return {
					_id: req.params.id
				}
			}
			return {};
		})();

		// Find by Id
		if (query._id) {
			Evaluacion.findOne(query, function(err, r) {
				req.evaluacion = r;
				next();
			});
		}
		// Find by All
		else {
			Evaluacion.find(query, function(err, records) {
				req.evaluaciones = records;
				next();
			});
		}
	}

	function postEvaluaciones(req, res, next) {
		var data = req.body;
		console.log(data);
		var model = new Evaluacion();
		model.participante_id = data.p_id;
		model.creativo_id = data.creativo_id;
		model.fecha = data.fecha;
		model.taller_id = data.taller_id;
		model.observaciones = data.observaciones;
		model.sensibilidad = data.sensibilidad;
		model.comunicacion = data.comunicacion;
		model.apreciacion = data.apreciacion;
		model.habilidades = new Array();
		var objeto = new Object();
		var cnt = 0;
		for (var key in data) {
			//console.log("++++++++++++");
			//console.log(key);
			var valor = data[key];
			if (valor == "") valor = 0;
			if (key.substring(0, 2) == 'i_') {
				var hab = key.substring(2);
				//console.log(hab);
				//console.log("valor:" + valor); 
				objeto[hab] = valor;
				cnt++;
			}
		}
		model.habilidades[0] = objeto;
		model.save(function(err, r) {
			req.evaluacion = r;
			next();
		});
	}

	function putEvaluaciones(req, res, next) {
		var data = req.body;
		var id = req.params.id;
		Evaluacion.update({
			_id: id
		}, data, function(err, r) {
			if (err) {
				res.error = true;
			}
			next();
		});
	}

	function delEvaluaciones(req, res, next) {
		var id = req.params.id;
		Evaluacion.findByIdAndRemove(id, function(err, r) {
			next();
		});
	}

	function getSesion(req, res, next) {
		var Sesion = app.db.model('Taller');
		console.log("\n\n\n\n\n");
		console.log(req.params.taller_id);
		Sesion.findById(req.params.taller_id, function(err, r) {
			req.sesion = r;
			console.log(r);
			next();
		});
	}

	function getParticipante(req, res, next) {
		var Participante = app.db.model('Participante');
		Participante.findById(req.params.participante_id, function(err, r) {
			req.participante = r;
			next();
		});
	}

	function getTallerBase(req, res, next) {
		var TallerBase = app.db.model('TallerBase');
		TallerBase.findById(req.sesion.actividad_id, function(err, r) {
			if (err) {
				console.log(err);
				res.error = true;
			}
			req.tallerbase = r;
			next();
		});
	}

	function getEvaluacion(req, res, next) {
		var Evaluacion = app.db.model('Evaluacion');
		Evaluacion.findOne({
			participante_id: req.params.participante_id,
			taller_id: req.params.taller_id
		}, function(err, r) {
			req.evaluacion = r;
			next();
		});
	}

	function getCreativo(req, res, next) {
		var Creativo = app.db.model('Creativo');
		Creativo.findOne(req.session.creativo_id, function(err, r) {
			req.creativo = r;
			next();
		});
	}

	/*
     * JSON
     */
	app.get('/evaluaciones.json', getEvaluaciones, function(req, res) {
		res.send(req.evaluaciones);
	});

	app.get('/evaluaciones/:id.json', getEvaluaciones, function(req, res) {
		res.send(req.evaluacion);
	});

	app.post('/evaluaciones', postEvaluaciones, function(req, res) {
		res.send(req.evaluacion, 201);
	});

	app.put('/evaluaciones/:id', putEvaluaciones, function(req, res) {
		if (req.error) res.send({
			'error': true
		}, 500);
		else res.send({
			'ok': true
		});
	});

	app.del('/evaluaciones/:id', delEvaluaciones, function(req, res) {
		res.send({
			'ok': true
		});
	});

	/*
     * HTML
     */
	app.get('/taller/:taller_id/participante/:participante_id/evaluacion', getEvaluacion, getSesion, getParticipante, getCreativo, getTallerBase, function(req, res) {
		res.render('forms/eval_participante', {
			locals: {
				evaluacion: req.evaluacion,
				params: app.params,
				participante: req.participante,
				creativo: req.creativo,
				taller: req.sesion,
				tallerbase: req.tallerbase,
				articulo: 'FormEvaluacion'
			}
		});
	});


	app.get('/evaluaciones/:id', getEvaluaciones, function(req, res) {
		res.render('evaluacion', {
			locals: {
				evaluacion: req.evaluacion
			}
		});
	});
}

module.exports = Service;