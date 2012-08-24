function Service(app) {
    var Taller = app.db.model('Taller');
    
    function getTalleres(req, res, next) {
        var query = (function() {
            if (req.params.id) {
                return { _id: req.params.id }
            }
            return {};
        })();
        
        // Find by Id
        if (query._id) {
            Taller.findOne(query, function(err, r) {
                req.taller = r;
                next();
            });
        }
        // Find by All
        else {
            Taller.find(query, function(err, records) {
                req.talleres = records;
                next();
            });
        }
    }

    function postTalleres(req, res, next) {
        var data = req.body;
        var model = new Taller(data);
        model.save(function(err, r) {
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
    app.get('/talleres/new', getTalleres, function(req, res) {
        res.render('taller', {
            locals: {
                // talleres: req.talleres
            }
        });
    });
    
    app.get('/talleres/:id', getTalleres, function(req, res) {
        res.render('taller', {
            locals: {
                taller: req.taller
            }
        });
    });
}

module.exports = Service;