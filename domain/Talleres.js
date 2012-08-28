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

    getTaller: function(req, res, next) {
	Taller.findOne(req.params.taller_id, function(err, data) {
	    req.taller = data;
	    next();
	});
    },

    postTaller: function(req, res, next) {
	req.creativo = '71381688';
	console.log(req.body)
	var fecha = parseInt(req.body.fecha);
	var taller = new Taller({
	    actividad_id: req.params.taller_id,
	    fecha: fecha,
	    creativos: [],
	    equipamiento    :  req.body.equipamiento,
	    participantes   :  [], 
	    resultados      :  '', 
	    autoeval_creativo: '', 
	    observ_externas :  '', 
	    fotos           :  [], 
	    videos          :  []
	});
	taller.creativos.push(req.creativo);

	taller.save(function(err, record) {
	    req.taller = record;
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
	res.send(req.taller_base);
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
		equipamientosTaller: [],
		talleres: req.talleres_base,
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
		articulo: 'FormTallerBase'
            }
	});
    });

    app.get('/talleres/:base_id', filtros.get, function(req, res) {
        res.render('taller', {
            locals: {
                articulo: 'Taller',
                taller: req.taller_base
            }
        });
    });
}

module.exports = Service;
