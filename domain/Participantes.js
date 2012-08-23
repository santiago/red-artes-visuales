function Service(app) {
    var Participante = app.db.model('Participante');

    app.get('/participantes/new', function(req, res) {
        res.render('participante', {
            locals: {
                model: {
                }
            }
        });
    });

    app.get('/participantes/evaluacion', function(req, res) {
        res.render('eval_participante', {
            locals: {
                // equipamientos: req.equipamientos
            }
        });
    });
}

module.exports = Service;