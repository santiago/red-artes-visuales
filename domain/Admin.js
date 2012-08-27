function Service(app) {
    var Creativo = app.db.model('Creativo');
    
    function getCreativos(req, res, next) {
        console.log("************"); 
        console.log(req.query);
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
            Creativo.findOne(query, function(err, r) {
                req.creativo= r;
                next();
            });
        }
        // Find by All
        else {
            Creativos.find(query, function(err, records) {
                req.creativos = records;
                next();
            });
        }
    }

    function postCreativos(req, res, next) {
        var data = req.body;
        var model = new Creativo(data);
        model.save(function(err, r) {
            if (err) {
              throw err;
            }
            req.creativo = r;
            next();
        });
    }

    function putCreativos(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        Creativo.update({ _id: id }, data, function(err, r) {
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

    /*
     * JSON
     */
    app.get('/admin/creativos.json', getCreativos, function(req, res) {
        res.send(req.equipamientos);
    });
    
    app.get('/admin/creativo/:id.json', getCreativos, function(req, res) {
        res.send(req.equipamiento);
    });
    
    app.post('/admin/creativos', postCreativos, function(req, res) {
        res.send(req.equipamiento, 201);
    });

    app.put('/admin/creativos/:id', putCreativos, function(req, res) {
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/admin/creativo/:id', delCreativos, function(req, res) {
        res.send({ 'ok': true });
    });

    /*
     * HTML
     */
    app.get('/admin/creativos', getCreativos, function(req, res) {
        console.log('###########-/admin/creativos-#########');
        res.render('admin/creativos', {
            locals: {
		            articulo: 'Creativos',
                creativos: req.creativos
            }
        });
    });

    app.get('/consultas/creativos', getCreativos, function(req, res) {
        res.render('admin/creativos', {
            layout: false,
            locals: {
            		articulo: 'Creativos',
                creativos: req.creativos
            }
        });
    });


    app.get('/admin/creativos/new', getCreativos, function(req, res) {
        res.render('/admin/creativo', {
            locals: {
          		articulo: 'FormCreativo',
		          params: app.params
	          }
        });
    });
    
    app.get('/equipamientos/:id', getEquipamientos, function(req, res) {
        res.render('equipamiento', {
            locals: {
                equipamiento: req.equipamiento
            }
        });
    });
}

module.exports = Service;
