function Service(app) {
    var Evaluacion = app.db.model('Evaluacion');
    
    function getEvaluaciones(req, res, next) {
        var query = (function() {
            if (req.params.id) {
                return { _id: req.params.id }
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
        var model = new Evaluacion(data);
        model.save(function(err, r) {
            req.evaluacion = r;
            next();
        });
    }

    function putEvaluaciones(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        Evaluacion.update({ _id: id }, data, function(err, r) {
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
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/evaluaciones/:id', delEvaluaciones, function(req, res) {
        res.send({ 'ok': true });
    });

    /*
     * HTML
     */
    app.get('/evaluaciones/new', getEvaluaciones, function(req, res) {
        res.render('evaluacion', {
            locals: {
                // evaluaciones: req.evaluaciones
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
