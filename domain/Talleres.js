var Taller, TallerBase;

var filtros = {
    get: function(req, res, next) {
        var query = (function() {
            if (req.params.id) {
                return { _id: req.params.id }
            }
            return {};
        })();
        
        // Find by Id
        if (query._id) {
            TallerBase.findOne(query, function(err, r) {
                req.taller = r;
                next();
            });
        }
        // Find by All
        else {
            TallerBase.find(query, function(err, records) {
                req.talleres = records;
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
        var id = req.params.id;
        Taller.update({ _id: id }, data, function(err, r) {
            if (err) {
                res.error = true;
            }
            next();
        });
    },

    del: function(req, res, next) {
        var id = req.params.id;
        Taller.findByIdAndRemove(id, function(err, r) {
            next();
        });
    }
};

function Service(app) {
    Taller = app.db.model('Taller');
    TallerBase = app.db.model('TallerBase');
    
    var Equipamientos = require('Equipamientos').filters;

    /*
     * JSON
     */
    app.get('/talleres.json', filtros.get, function(req, res) {
        res.send(req.talleres);
    });
    
    app.get('/talleres/:id.json', filtros.get, function(req, res) {
        res.send(req.taller);
    });
    
    app.post('/talleres', filtros.post, function(req, res) {
        res.send(req.taller, 201);
    });

    app.put('/talleres/:id', filtros.put, function(req, res) {
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/talleres/:id', filtros.del, function(req, res) {
        res.send({ 'ok': true });
    });

    /*
     * HTML
     */
    app.get('/talleres', filtros.get, Equipamientos.get, function(req, res) {
      TallerBase.find({}, function(err,talleres) {
        console.log(talleres.length)
	  res.render('talleres', {
              locals: {
		  talleres: talleres,
		  articulo: 'Talleres'
              }
	  });
      });
    });

    app.get('/talleres/taller/new', function(req, res) {
      res.render('forms/taller', {
        locals: {
          params: app.params,
          articulo: 'FormTaller'
        }
      });
    }); 

    app.get('/consultas/talleres', filtros.get, function(req, res) {
	    res.render('partials/lista_talleres', {
            layout: false,
		locals: {
		    talleres: req.talleres,
		    articulo: 'Talleres'
		}
	    });
    });

    app.get('/talleres/new', function(req, res) {
	res.render('forms/taller_base', {
            locals: {
		params: app.params,
		articulo: 'FormTaller'
            }
	});
    });
    
    app.get('/talleres/:id', filtros.get, function(req, res) {
        res.render('taller', {
            locals: {
                articulo: "Taller",
                taller: req.taller
            }
        });
    });
}

module.exports = Service;
