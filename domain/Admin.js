require('date-utils')

function Service(app) {
	var Creativo = app.db.model('Creativo');
	var Usuario = app.db.model('Usuario');
	var TallerBase = app.db.model('TallerBase');
	var Taller = app.db.model('Taller');
	var Evaluacion = app.db.model('Evaluacion');

	function generarSeguimiento(req, res, next) {
		Evaluacion.find({ creativo_id: req.creativo_id }, { sort: { actualizado: -1 } }, function(err, records) {
			for (var obj in records) {
				console.log(obj.actualizado);
				console.log(typeof obj.actualizado);
			}
		});
	}

	function getCreativos(req, res, next) {
		var query = (function() {
			if (req.params.creativo_id) {
				return {
					_id: req.params.creativo_id
				}
			}
			if (req.query) {
				return req.query;
			}
			return {};
		})();

		// Find by Id
		if (query._id) {
			Creativo.findOne(query, function(err, r) {
				req.creativo = r;
				next();
			});
		}
		// Find by All
		else {
			Creativo.find(query).sort({ nombre: 'asc' })
				.exec(function(err, records) {
					req.creativos = records;
					next();
				});
		}
	}

	function getTaller_Bases(req, res, next) {
		var query = (function() {
			if (req.params.id) {
				return {
					_id: req.params.id
				}
			}
			if (req.query) {
				return req.query;
			}
			return {};
		})();

		if (query._id) {
			TallerBase.findOne(query, function(err, r) {
				req.taller_base = record;
				next();
			});
		}
		else {
			Taller.find(query, function(err, talleres) {
				req.talleres = talleres;
				var id_array = new Array();
				req.talleres.forEach(function(item, index) {
					id_array[index] = item.actividad_id;
				});
				TallerBase.find({
					'_id': {
						$in: id_array
					}
				}, function(err, records) {
					req.taller_bases = records;
					checkInfoProvided(req.taller_bases, req);
					next();
				});
			});
		}
	}

	function checkInfoProvided(taller_bases, req) {
		var info_provided = new Array();
		for (var i = 0; i < taller_bases.length; i++) {
			info_provided[i] = i % 2;
		}
		req.talleres_info_provided = info_provided;
	}

	function postCreativos(req, res, next) {
		var crypto = require('crypto');
		var crypt_key = app.crypt_key;
		var data = req.body;
		var model = new Creativo(data);
		var default_passwd = req.body.cedula;
		var hashed_default_passwd = crypto.createHmac('sha1', crypt_key).update(default_passwd).digest('hex');
		var user = new Usuario({
			email: req.body.email,
			rol: 'creativo',
			cedula: req.body.cedula,
			contrasena: hashed_default_passwd
		});
		user.save(function(err, u) {
			if (err) {
				res.send(500);
			}
			model.save(function(err, r) {
				if (err) {
					res.send(500);
				}
				req.creativo = r;
				next();
			});
		});
	}

	function putCreativos(req, res, next) {
		var data = req.body;
		var id = req.params.creativo_id;
		Creativo.update({
			_id: id
		}, data, function(err, r) {
			if (err) {
				res.error = true;
			}
			next();
		});
	}

	function delCreativos(req, res, next) {
		var id = req.params.id;
		Creativo.findByIdAndRemove(id, function(err, r) {
			next();
		});
	}
    
    function getAllCreativos(req, res, next) {
        Creativo.find(function(err, data) {
            req.creativos = data;
            next()
        })
    }
    
    function getControl(req, res, next) {
        var start = req.query.f ? new Date(parseInt(req.query.f)) : new Date;
        
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);

        var weekday = Date.getDayNumberFromName(start.toString().split(' ')[0]);
        var sunday = start.add({ days: -weekday });
        var saturday = start.clone().add({ weeks: 1 });
         
        Taller.find({ fecha: { "$gte": sunday , "$lte": saturday } }, function(err, data) {
            var talleresByCreativo = {}
            
            data.forEach(function(taller) {
                // Record to plain JS object
                taller = taller.toObject();
                
                if (!talleresByCreativo[taller.creativo_cedula]) 
                    talleresByCreativo[taller.creativo_cedula] = [0,0,0,0,0,0,0];
                    
                var day = Date.getDayNumberFromName(taller.fecha.toString().split(' ')[0]);
                talleresByCreativo[taller.creativo_cedula][day] = taller;
            });
            
            req.control = generateControl(talleresByCreativo);
            
            console.log(req.control)
            
            next()
        });
        
        function generateControl(talleres) {
            console.log('\n\n\n\nreq.creativos')
            console.log(req.creativos)
            return req.creativos.map(function(creativo) {
                var week = talleres[creativo.cedula] ? talleres[creativo.cedula].slice(1,7) : [0,0,0,0,0,0];
                return {
                    creativo_cedula: creativo.cedula,
                    creativo_nombre: creativo.nombre,
                    talleres: week
                }
            });
        }

    }
    
	/*
     * JSON
     */
	app.get('/admin/creativos.json', getCreativos, function(req, res) {
		res.send(req.equipamientos)
	});

	app.get('/admin/creativo/:id.json', getCreativos, function(req, res) {
		res.send(req.equipamiento)
	});

	app.post('/admin/creativos', postCreativos, function(req, res) {
		res.send(req.equipamiento, 201)
	});

	app.put('/creativos/:creativo_id', putCreativos, function(req, res) {
		if (req.error) res.send({
			'error': true
		}, 500);
		else res.send({
			'ok': true
		});
	});

	app.del('/admin/creativo/:id', delCreativos, function(req, res) {
		res.send({
			'ok': true
		})
	});

	/*
     * HTML
     */
	app.get('/admin/creativos', getCreativos, function(req, res) {
		res.render('admin/creativos', {
			locals: {
				articulo: 'Creativos',
				creativos: req.creativos
			}
		})
	});

	app.get('/consultas/creativos', getCreativos, function(req, res) {
		res.render('admin/creativos', {
			layout: false,
			locals: {
				articulo: 'Creativos',
				creativos: req.creativos
			}
		})
	});


	app.get('/admin/creativos/new', function(req, res) {
		res.render('admin/creativo', {
			locals: {
				articulo: 'FormCreativo',
				params: app.params
			}
		});
	});

	app.get('/creativos/:creativo_id', getCreativos, function(req, res) {
		res.render('admin/editar_creativo', {
			locals: {
				articulo: 'EditarCreativo',
				creativo: req.creativo
			}
		})
	});
	
	app.get('/creativos/:creativo_id/seguimiento', getCreativos, generarSeguimiento, function(req, res) {
		req.render('admin/seguimiento_creativo', {
			locals: {
				articulo: 'SeguimientoCreativo',
				creativo: req.creativo,
				seguimiento: req.seguimiento
			}
		})
	});
	
    app.get('/admin/control', getAllCreativos, getControl, function(req, res) {
        res.render('admin/control', {
            locals: {
                articulo: 'Control',
                creativos: req.creativos,
                control: req.control
            }
        })
    });
    
}

module.exports = Service;