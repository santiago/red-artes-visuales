require('date-utils')
var fs = require('fs');
var csv = require('ya-csv');

function Service(app) {
	var Creativo = app.db.model('Creativo');
	var Usuario = app.db.model('Usuario');
	var TallerBase = app.db.model('TallerBase');
	var Taller = app.db.model('Taller');
	var Evaluacion = app.db.model('Evaluacion');
    var Equipamiento = app.db.model('Equipamiento');
    var Participante = app.db.model('Participante');

    function isAdmin(req, res, next) {
        if(req.user.perfil == 'admin') {
            next();
            return;
        }
        res.send(403); // Access Forbidden
    }
    
    function getPeriodo(req, res, next) {
        var Periodo = app.db.model('Periodo');
        var periodo = req.session.periodo;
        Periodo.findOne({ periodo: periodo }, function(err, p) {
            req.session.inicioPeriodo = p.get('inicio');
            req.session.finPeriodo = p.get('fin');
            next();
        });
    }
    
    function generarSeguimiento(req, res, next) {
		Evaluacion.find({ creativo_id: req.creativo_id }, { sort: { actualizado: -1 } }, function(err, records) {
			for (var obj in records) {
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
            function findUser(cedula) {
                Usuario.findOne({ cedula: cedula }, function(err, r) {
                    req.usuario = r;
                    next()  
                })
            }
			Creativo.findOne(query, function(err, r) {
				req.creativo = r;
                findUser(r.cedula);
			});
		}
		// Find by All
		else {
            function findUsuarios() {
                req.usuarios = {};
                Usuario.find(function(err, records) {
                    records.forEach(function(u) {
                        req.usuarios[u.cedula] = u;
                    });
                    next();
                });
            }
			Creativo.find(query).sort({ nombre: 'asc' })
				.exec(function(err, records) {
					req.creativos = records;
                    findUsuarios();
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
				req.taller_base = r;
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
        var saturday = start.clone().add({ weeks: 1, minutes: -1 });
        
        req.date_string = sunday.toDateString().slice(4) + " - " + saturday.toDateString().slice(4);
         
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
            
            next()
        });
        
        function generateControl(talleres) {
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

    function generateExcelReport(req, res, next) {    
        var Asistencia = app.db.model('Asistencia');
        var metodologias = require('../params').metodologias;

        var fields = {
            participantes: [
                ['nombre', 'Nombre Completo'], ['documento', 'No. de Documento'], ['tipo_documento', 'Tipo Doc'], ['grado', 'Grado'], 
                ['edad', 'Edad'], ['direccion', 'Dirección'], ['comuna', 'Comuna'], ['barrio', 'Barrio'],
                ['estrato', 'Estrato'], ['telefono', 'Teléfono'], ['contacto', 'Contacto'], ['DOC_ACUDIENTE', 'Doc. Identidad Acudiente'], 
                ['familiar', 'Situación familiar'], ['poblacion', 'Población'], ['padres', 'Nivel estudio padres'], ['observaciones', 'Observaciones']
            ],
            equipamientos: [
                ['nombre', 'Nombre Completo'], ['ubicacion', 'Dirección'], ['comuna', 'Comuna'], ['barrio', 'Barrio'],
                ['email', 'Email'], ['telefono', 'Teléfono'], ['otros_talleres', 'Otros talleres'], ['contacto', 'Contacto'], 
                ['tipo', 'Clase de equipamiento'], ['e_equipos', 'Equipos disponibles'], ['locker', 'Tiene locker'], 
                ['banos', 'Baños cerca'], ['e_equipos', 'Equipos electrónicos'], ['horario', 'Horario'], 
                ['seguridad', 'Situación de la zona'], ['zona', 'Zona'], ['como_llegar', 'Cómo llegar'], ['web', 'Web'], 
                ['fb', 'Facebook'], ['twitter', 'Twitter'], ['blog', 'Blog'], ['newsletter', 'Newsletter'], 
                ['cartelera', 'Cartelera'], ['telefono_info', 'Teléfono Info'], ['perifonia', 'Perifonía'], ['boletin', 'Boletín'],
                ['medios_comunit', 'Medios Comunitarios'], ['emailing', 'E-mailing'], ['observaciones', 'Comentarios']
            ],
            talleres: [
                ['nombre', 'Nombre actividad'], ['descripcion', 'Descripción'], ['objetivos', 'Objetivos'], 
                ['metodologias', metodologias], ['comentarios', 'Comentarios']
            ],
            asistencia: []
        };

        function generarHeaderAsistencia(writer) {
            var inicioPeriodo = req.session.inicioPeriodo, finPeriodo = req.session.finPeriodo;
            var today = Date.today();
            var atWeek = inicioPeriodo.clone();
            var weekHeaders = [];            
            
            var between = today.isBefore(finPeriodo) ?
                inicioPeriodo.getDaysBetween(today) :
                inicioPeriodo.getDaysBetween(finPeriodo);

            var weeks = parseInt(between / 7);
            for(var i=0; i < weeks; i++) {
                weekHeaders.push(atWeek.toDateString().slice(4, 10).replace(' ', '.'));
                atWeek.add({ weeks: 1 });
            }
            var header = ['Equipamiento', 'Participante'].concat(weekHeaders);
            writer.writeRecord(header);
        }
        
        function generarAsistencia(participante, equipamiento, writer) {
            var inicioPeriodo = req.session.inicioPeriodo;
            
            Asistencia.find({ participante_id: participante._id.toString() }, 
                function(err, data) {
                    var week = 0;
                    var asistencia = [];
                    data.forEach(function(asist) {
                        var fecha = asist.get('fecha');
                        var between = inicioPeriodo.getDaysBetween(fecha);
                        var atWeek = parseInt(between / 7);
                        for(var i = week; i < atWeek; i++) {
                            asistencia.push('N/D');
                        }
                        asistencia.push(asist.get('asistencia'));
                        week = ++atWeek;
                    });
                    var row = [equipamiento.nombre, participante.nombre].concat(asistencia);
                    writer.writeRecord(row);
                });
        }
        
        function getCsvWriter(resource) {
            // Open File
            var file = fs.createWriteStream('./public/reportes/'+resource+'.csv', { flags: 'w', mode: '0666' });
            var writer = new csv.CsvWriter(file);
            // Write headers corresponding to this writer's file
            if(fields[resource].length ) {
                var header = [];
                fields[resource].forEach( function(f) {
                    if (typeof f[1] == 'string') header.push(f[1])
                    else if(f[1].length) { // Let's just assume it's an Array if it's got length
                        f[1].forEach(function(n) {
                            header.push(n);
                        });
                    }
                } );
                writer.writeRecord(header);
            }
            return writer;
        }

        function writeRecord(resource, data, writer) {
            var record = [];
            fields[resource].forEach(function(f) {
                var _data = data.get(f[0]);
                if(typeof f[1] == 'string')
                    record.push(_data)
                else if(f[1].length) { // Let's just assume it's an Array if it's got length
                    f[1].forEach(function(n) {
                        _data.indexOf(n) > -1 ?
                            record.push('Sí') :
                            record.push('No')
                    });
                }
            });
            writer.writeRecord(record);
        }

        TallerBase.find({ periodo: '2012' }, function(err, talleres) {
            if(err) { return }
            // Generate participantes.csv
            var tallerWriter = getCsvWriter('talleres');
            talleres.forEach(function(taller) {
                console.log(taller.get('metodologias'));
                writeRecord('talleres', taller, tallerWriter);
            })
        })

        // Participantes
        Equipamiento.find(function(err, equipamientos) {
            // Generate equipamientos.csv
            var equipWriter = getCsvWriter('equipamientos');
            var partiWriter = getCsvWriter('participantes');
            var asistWriter = getCsvWriter('asistencia');
            
            generarHeaderAsistencia(asistWriter);

            equipamientos.forEach(function(equip) {
                writeRecord('equipamientos', equip, equipWriter);

                Participante.find({ equipamiento_id: equip._id.toString() }, function(err, participantes) {
                    if(err) { return }
                    // Generate participantes.csv
                    participantes.forEach(function(parti) {
                        // Generar Asistencia para este Participante
                        generarAsistencia(parti, equip, asistWriter);
                        writeRecord('participantes', parti, partiWriter);
                    });
                })
            });
        });

        next()
    } // End of generateExcelReport()

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

    app.all('/admin/*', isAdmin);
    app.all('/creativo/*', isAdmin);
    app.all('/creativos/*', isAdmin);


	/*
     * HTML
     */
	app.get('/admin/creativos', getCreativos, function(req, res) {
		res.render('admin/creativos', {
			locals: {
				articulo: 'Creativos',
				creativos: req.creativos,
                usuarios: req.usuarios
			}
		})
	});

    app.get('/admin/reportes', getPeriodo, generateExcelReport, function(req, res) {
		res.render('admin/reportes', {
			locals: {
				articulo: 'Reportes'
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
				creativo: req.creativo,
                usuario: req.usuario
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
                control: req.control,
                date_string: req.date_string
            }
        })
    });
    
    app.post('/creativo/:creativo_id/perfil', getCreativos, /*isAdmin,*/ function(req, res) {
        req.usuario.set('perfil', req.body.perfil); 
        req.usuario.save(function(err, r) {
            console.log(r);
        });
        res.send({ ok: true })
    });
    
    /*app.get('/reportes/:reporte', function(req, res) {
        if(['talleres','equipamientos', 'participantes', 'asistencia']
            .indexOf(req.params['reporte'])) {
            sendFile();
        } else {
            res.send(404);
        }
        
        function sendFile() {
            // Note: should use a stream here, instead of fs.readFile
            fs.readFile('./public/reportes/' + req.params['reporte'], function(err, data) {
                if(err) {
                    res.send("Oops! Couldn't find that file.");
                } else {
                    // set the content type based on the file
                    res.contentType('application/octet-stream');
                    res.send(data);
                }   
                res.end();
            }); 
        }
    });*/
}
module.exports = Service;