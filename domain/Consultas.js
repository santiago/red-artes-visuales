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

    /*
     * HTML
     */
    app.get('/consultas', getEquipamientos, function(req, res) {
        res.render('consultas', {
	    locals: {
		articulo: 'Consultas',
		params: app.params,
		equipamientos: req.equipamientos
	    }
        });
    });
}

module.exports = Service;