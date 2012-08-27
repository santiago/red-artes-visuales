function Service(app) {
    var Taller = app.db.model('Taller');
    var TallerBase = app.db.model('TallerBase');
    
    function getTalleres(req, res, next) {
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
    }

    function postTalleres(req, res, next) {
        var data = req.body;
        var model = new TallerBase(data);
        model.save(function(err, r) {
          if (err) {
            throw err;
          }
          req.taller = r;
          next();
        });
    }

    function putTalleres(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        Taller.update({ _id: id }, data, function(err, r) {
            if (err) {
                res.error = true;
            }
            next();
        });
    }

    function delTalleres(req, res, next) {
        var id = req.params.id;
        Taller.findByIdAndRemove(id, function(err, r) {
            next();
        });
    }

    /*
     * JSON
     */
    app.get('/talleres.json', getTalleres, function(req, res) {
        res.send(req.talleres);
    });
    
    app.get('/talleres/:id.json', getTalleres, function(req, res) {
        res.send(req.taller);
    });
    
    app.post('/talleres', postTalleres, function(req, res) {
        res.send(req.taller, 201);
    });

    app.put('/talleres/:id', putTalleres, function(req, res) {
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/talleres/:id', delTalleres, function(req, res) {
        res.send({ 'ok': true });
    });

    /*
     * HTML
     */
    app.get('/talleres', getTalleres, function(req, res) {
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

    app.get('/consultas/talleres', getTalleres, function(req, res) {
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
    
    app.get('/talleres/:id', getTalleres, function(req, res) {
        res.render('taller', {
            locals: {
                articulo: "Taller",
                taller: req.taller
            }
        });
    });
}

module.exports = Service;
