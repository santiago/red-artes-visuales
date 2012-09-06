function Service(app) {
    var Participante = app.db.model('Participante');

    function getParticipantes(req, res, next) {
        var query = (function() {
            if (req.params.id) {
                return { _id: req.params.id }
            }
            return {};
        })();
        
        // Find by Id
        if (query._id) {
            Participante.findOne(query, function(err, r) {
                req.participante = r;
                next();
            });
        }
        // Find by All
        else {
            Participante.find(query, { sort: '-nombre' }, function(err, records) {
                req.participantes = records;
                next();
            });
        }
    }

    function postParticipantes(req, res, next) {
        var data = req.body;
        var model = new Participante(data);
        model.save(function(err, r) {
            req.participante = r;
            next();
        });
    }

    function putParticipantes(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        Participante.update({ _id: id }, data, function(err, r) {
            if (err) {
                res.error = true;
            }
            next();
        });
    }

    function delParticipantes(req, res, next) {
        var id = req.params.id;
        Participante.findByIdAndRemove(id, function(err, r) {
            next();
        });
    }

    function getEquipamiento(req, res, next) {
	var Equipamiento = app.db.model('Equipamiento');
	Equipamiento.findById(req.params.equipamiento_id, function(err, r) {
	    req.equipamiento = r;
	    next();
	});
    }

    /*
     * JSON
     */
    app.get('/participantes.json', getParticipantes, function(req, res) {
        res.send(req.participantes);
    });
    
    app.get('/participantes/:id.json', getParticipantes, function(req, res) {
        res.send(req.participante);
    });
    
    app.post('/participantes', postParticipantes, function(req, res) {
        res.send(req.participante, 201);
    });

    app.put('/participantes/:id', putParticipantes, function(req, res) {
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/participantes/:id', delParticipantes, function(req, res) {
        res.send({ 'ok': true });
    });


    /*
     * HTML
     */
    app.get('/participantes', getParticipantes, function(req, res) {
        res.render('participantes', {
	    locals: {
		articulo: "Participantes",
		participantes: req.participantes
	    }
        });
    });


    app.get('/consultas/participantes/equipamiento/:id', function(req, res) {
	Participante.find({'equipamiento_id': req.params.id}, function(err, participantes) {
            if (err) {
		console.log(err);
            }
            res.render('partials/lista_participantes', {
		layout: false,
		locals: {
                    articulo: 'Participantes',
                    participantes: participantes
		}
            });
	});
    });

    app.get('/consultas/participantes', getParticipantes, function(req, res) {
        res.render('partials/lista_participantes', {
            layout: false,
            locals: {
                articulo: 'Participantes',
                participantes: req.participantes
            }
        });
    });

    // Agregar Participante a Equipamiento
    app.get('/equipamientos/:equipamiento_id/participantes/new', getEquipamiento, function(req, res) {
        res.render('forms/participante', {
            locals: {
                equipamiento: req.equipamiento,
                params: app.params,
                articulo: 'FormParticipante'
            }
        });
    });
    
    app.get('/participantes/:id', getParticipantes, function(req, res) {
        res.render('participante', {
            locals: {
                participante: req.participante
            }
        });
    });
}

module.exports = Service;
