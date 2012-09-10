var Equipamiento, Taller, TallerBase, Participante;

var filters = {
	get: function(req, res, next) {
		var query = (function() {
			if (req.params.equipamiento_id) {
				return {
					_id: req.params.equipamiento_id
				}
			}
			if (req.query) {
				return req.query;
			}
			return null;
		})();

		// Find by Id
		if (query) {
			if (query._id) {
				Equipamiento.findOne(query, function(err, r) {
					req.equipamiento = r;
					next();
				});
			}
			else {
				Equipamiento.find(query).sort({
					nombre: 'asc'
				}).exec(function(err, records) {
					req.equipamientos = records;
					next();
				});
			}
		}
	},

	getAll: function(req, res, next) {
		Equipamiento.find().sort({
			nombre: 'asc'
		}).exec(function(err, records) {
			req.equipamientos = records;
			next();
		});
	},

	post: function(req, res, next) {
		var data = req.body;
		var model = new Equipamiento(data);
		model.save(function(err, r) {
			if (err) {
				res.send(500);
			}
			req.equipamiento = r;
			next();
		});
	},

	put: function(req, res, next) {
		var data = req.body;
		var id = req.params.id;
		Equipamiento.update({
			_id: id
		}, data, function(err, r) {
			if (err) {
				res.error = true;
			}
			next();
		});
	},

	del: function(req, res, next) {
		var id = req.params.id;
		Equipamiento.findByIdAndRemove(id, function(err, r) {
			next();
		});
	},

	getSesiones: function(req, res, next) {
		var id = req.params.equipamiento_id;
		Taller.find({
			equipamiento_id: id
		}, function(err, rs) {
			req.sesiones = rs;
			next();
		});
	},

	getTalleres: function(req, res, next) {
		TallerBase.find(function(err, rs) {
			req.talleres = rs;
			next();
		});
	},
	
	getParticipantes: function(req, res, next) {
		Participante.find({ 'equipamiento_id': req.params.equipamiento_id }).sort({ nombre: 'asc' })
			.exec(function(err, records) {
				req.participantes = records;
				next();
			});
	}
}

function Service(app) {
	Participante = app.db.model('Participante');
	Equipamiento = app.db.model('Equipamiento');
	Taller = app.db.model('Taller');
	TallerBase = app.db.model('TallerBase');

	/*
     * JSON
     */
	app.get('/equipamientos.json', filters.get, function(req, res) {
		res.send(req.equipamientos);
	});

	app.get('/equipamientos/:id.json', filters.get, function(req, res) {
		res.send(req.equipamiento);
	});

	app.post('/equipamientos', filters.post, function(req, res) {
		res.send(req.equipamiento, 201);
	});

	app.put('/equipamientos/:id', filters.put, function(req, res) {
		if (req.error) res.send({
			'error': true
		}, 500);
		else res.send({
			'ok': true
		});
	});

	app.del('/equipamientos/:id', filters.del, function(req, res) {
		res.send({
			'ok': true
		});
	});

	/*
     * HTML
     */
	app.get('/equipamientos', filters.get, function(req, res) {
		res.render('equipamientos', {
			locals: {
				articulo: 'Equipamientos',
				equipamientos: req.equipamientos
			}
		});
	});

	app.get('/equipamientos/:equipamiento_id/general', filters.get, function(req, res) {
		res.render('equipamiento_general', {
			locals: {
				articulo: 'General',
				edit: false,
				equipamiento: req.equipamiento,
				params: app.params
			}
		});
	});

	app.get('/equipamientos/:equipamiento_id/edit', filters.get, function(req, res) {
		res.render('equipamiento_general', {
			locals: {
				articulo: 'EditarEquipamiento',
				edit: true,
				equipamiento: req.equipamiento,
				params: app.params
			}
		});
	});


	app.get('/consultas/equipamientos', filters.get, function(req, res) {
		res.render('partials/lista_equipamientos', {
			layout: false,
			locals: {
				articulo: 'Equipamientos',
				equipamientos: req.equipamientos
			}
		});
	});

	app.get('/equipamientos/new', function(req, res) {
		res.render('forms/equipamiento', {
			locals: {
				articulo: 'FormEquipamiento',
				params: app.params
			}
		});
	});

	app.get('/equipamientos/:equipamiento_id', filters.get, filters.getTalleres, filters.getSesiones, function(req, res) {
		res.render('equipamiento', {
			locals: {
				articulo: 'EquipamientoTalleres',
				params: app.params,
				equipamiento: req.equipamiento,
				sesiones: req.sesiones,
				talleres: req.talleres
			}
		});
	});

	app.get('/equipamientos/:equipamiento_id/participantes', filters.get, filters.getParticipantes, function(req, res) {
		res.render('equipamientos/participantes', {
			locals: {
				equipamiento: req.equipamiento,
				participantes: req.participantes,
				params: app.params,
				articulo: 'Participantes'
			}
		});
	});
}

module.exports = Service;
module.exports.filters = filters;