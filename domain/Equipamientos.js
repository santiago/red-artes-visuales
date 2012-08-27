var Equipamiento;

var filters = {
    get: function(req, res, next) {
	var query = (function() {
            if (req.params.id) {
		return { _id: req.params.id }
            }
            if (req.query) {
		return req.query;
            }
            return {};
	})();
        
        // Find by Id
        if (query._id) {
            Equipamiento.findOne(query, function(err, r) {
                req.equipamiento = r;
                next();
            });
        }
        // Find by All
        else {
            Equipamiento.find(query, function(err, records) {
                req.equipamientos = records;
                next();
            });
        }
    },

    post: function(req, res, next) {
        var data = req.body;
        var model = new Equipamiento(data);
        model.save(function(err, r) {
            if (err) {
              throw err;
            }
            req.equipamiento = r;
            next();
        });
    },

    put: function(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        Equipamiento.update({ _id: id }, data, function(err, r) {
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
    }
}

function Service(app) {
    Equipamiento = app.db.model('Equipamiento');

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
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/equipamientos/:id', filters.del, function(req, res) {
        res.send({ 'ok': true });
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

    app.get('/consultas/equipamientos', filters.get, function(req, res) {
        res.render('partials/lista_equipamientos', {
            layout: false,
            locals: {
            		articulo: 'Equipamientos',
                equipamientos: req.equipamientos
            }
        });
    });

    app.get('/equipamientos/new', filters.get, function(req, res) {
        res.render('forms/equipamiento', {
            locals: {
		articulo: 'FormEquipamiento',
		params: app.params
	    }
        });
    });
    
    app.get('/equipamientos/:id', filters.get, function(req, res) {
        res.render('equipamiento', {
            locals: {
                equipamiento: req.equipamiento
            }
        });
    });
}

module.exports = Service;
module.exports.filters = filters;