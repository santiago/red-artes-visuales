function Service(app) {
    var Equipamiento = app.db.model('Equipamiento');
    
    function getEquipamientos(req, res, next) {
        var query = (function() {
            if (req.params.id) {
                return { _id: req.params.id }
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
    }

    function postEquipamientos(req, res, next) {
        var data = req.body;
        var model = new Equipamiento(data);
        model.save(function(err, r) {
            req.equipamiento = r;
            next();
        });
    }

    function putEquipamientos(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        Equipamiento.update({ _id: id }, data, function(err, r) {
            next();
        });
    }

    function delEquipamientos(req, res, next) {
        var id = req.params.id;
        Equipamiento.findByIdAndRemove(id, function(err) {
            next();
        });
    }

    /*
     * JSON
     */
    app.get('/equipamientos.json', getEquipamientos, function(req, res) {
        res.send(req.equipamientos);
    });
    
    app.get('/equipamientos/:id.json', getEquipamientos, function(req, res) {
        res.send(req.equipamiento);
    });


    /*
     * HTML
     */
    app.get('/equipamientos/new', getEquipamientos, function(req, res) {
        res.render('equipamiento', {
            locals: {
                // equipamientos: req.equipamientos
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

    app.post('/equipamientos', postEquipamientos, function(req, res) {
        res.send(req.equipamiento);
    });

    app.put('/equipamientos/:id', putEquipamientos, function(req, res) {
        res.send({ 'ok': true });
    });

    app.del('/equipamientos/:id', delEquipamientos, function(req, res) {
        res.send({ 'ok': true });
    });
}

module.exports = Service;