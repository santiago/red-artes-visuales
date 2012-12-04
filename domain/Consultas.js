function Service(app) {
    var Equipamiento = app.db.model('Equipamiento');
    
    function equipamientos(req, res, next) {
        var Equipamiento = app.db.model('Equipamiento');
        Equipamiento.find().sort({ nombre: 'asc' })
            .exec(function(err, data) {
                req._equipamientos = data.map(function(v) {
                    return {
                        label: v.nombre,
                        value: v._id
                    }
                });
                next();
            });
    }
    
    function creativos(req, res, next) {
        var Creativo = app.db.model('Creativo');
        Creativo.find().sort({ 'nombre': 'asc'})
            .exec(function(err, data) {
                req.creativos = data.map(function(v) {
                    return { 
                        label: v.nombre,
                        value: v.cedula
                    }
                });
                next();
            });
    }

    function params(req, res, next) {
        req.params = {};
        for(var param in app.params) {
            req.params[param] = app.params[param].map(function(v) {
                return {
                    label: v,
                    value: v
                }
            })
        }
        next();
    }

    function findByComuna(req, res, next) {
        if(req.query.comuna) {
            Equipamiento.find({ comuna: req.query.comuna }, function(err, data) {
                if(err) {
                    next();
                } else {
                    req.equipamientos = data;
                    req.by_comuna = data.map(function(v) {
                        return v._id.toString();
                    });
                    next()
                }
            });
            
            return
        }
        next()
    }
        
    function findByBarrio(req, res, next) {
        if(req.query.barrio) {
            Equipamiento.find({ barrio: req.query.barrio }, function(err, data) {
                if(err) {
                    next();
                    return
                } else {
                    req.equipamientos = data;
                    
                    if(!data.length) {
                        next()
                        return
                    }
                    
                    req.by_barrio = data.map(function(v) {
                        return v._id.toString();
                    });
                    next()
                }
            });
            return
        }
        next()
    }
        
    function find(req, res, next) {
        var q = req.query.q;
        if(!q) {
            next();
            return
        }
        
        try {
            var Model = app.db.model(q);
            req.recurso = { 'Taller': 'talleres', 
                             'Equipamiento':'equipamientos',
                             'Participante': 'participantes'
                            }[q];
        } catch(e) {
            next()
            return
        }
        
        if((req.by_barrio || req.by_comuna) && q != 'Equipamiento') {
            if(q == 'Taller') {
                req.query['equipamiento_id'] = { '$in': req.by_barrio||req.by_comuna };

                delete req.query['barrio'];
                delete req.query['comuna'];
            }
        }
        
        delete req.query['q'];
        
        Model.find(req.query, function(err, data) {
            if(q == 'Taller') {
                req.creativosByCedula = {};
                req.creativos.forEach(function(c) {
                    req.creativosByCedula[c.value] = c.label;
                });
            }
            req.resultado = data;
            next()
        });
    }

    /*
     * HTML
     */
    app.get('/consultas', creativos, equipamientos, params, findByComuna, findByBarrio, find, function(req, res) {        
        res.render('consultas', {
	        locals: {
		        articulo: 'Consultas',
		        params: req.params,
		        _equipamientos: req._equipamientos,
                creativos: req.creativos,
                creativosByCedula: req.creativosByCedula,
                recurso: req.recurso || 'talleres',
                resultado: req.resultado || []
	        }
        });
    });
}

module.exports = Service;