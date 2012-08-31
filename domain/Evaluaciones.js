function Service(app) {
    var Evaluacion = app.db.model('Evaluacion');
    var Taller= app.db.model('Taller');
    var TallerBase= app.db.model('TallerBase');
    var Participante = app.db.model('Participante');
    var Creativo = app.db.model('Creativo');
    
    function getEvaluaciones(req, res, next) {
        var query = (function() {
            if (req.params.id) {
                return { _id: req.params.id }
            }
            return {};
        })();
        
        // Find by Id
        if (query._id) {
            Evaluacion.findOne(query, function(err, r) {
                req.evaluacion = r;
                next();
            });
        }
        // Find by All
        else {
            Evaluacion.find(query, function(err, records) {
                req.evaluaciones = records;
                next();
            });
        }
    }

    function postEvaluaciones(req, res, next) {
        var data = req.body;
        console.log(data);
        var model = new Evaluacion();
        model.participante_id = data.p_id;
        model.creativo_id = data.creativo_id;
        model.fecha = data.fecha;
        model.taller_id = data.taller_id;
        var habilidades_cnt = app.params.habilidades.length;
        model.habilidades = new Array(habilidades_cnt);
        model.valores = new Array(habilidades_cnt);
        var cnt = 0;
        for (var key in data) {
//        console.log("++++++++++++");
//          console.log(key);
//          console.log(key.substring(0,2));
          if (key.substring(0,2) == 'i_') {
//            console.log("-----------+");
            var obj = data[key];
            var hab = key.substring(2);
            model.habilidades[cnt] = hab;
            model.valores[cnt] = obj;
            cnt++;
          }
        }
        model.save(function(err, r) {
            req.evaluacion = r;
            next();
        });
    }

    function putEvaluaciones(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        Evaluacion.update({ _id: id }, data, function(err, r) {
            if (err) {
                res.error = true;
            }
            next();
        });
    }

    function delEvaluaciones(req, res, next) {
        var id = req.params.id;
        Evaluacion.findByIdAndRemove(id, function(err, r) {
            next();
        });
    }

    function getSesion(req, res, next) {
	var Sesion = app.db.model('Taller');
	console.log("\n\n\n\n\n");
	console.log(req.params.taller_id);
	Sesion.findById(req.params.taller_id, function(err, r) {
	    req.sesion = r;
	    next();
	});
    }

    function getParticipante(req, res, next) {
	var Participante = app.db.model('Participante');
	Participante.findById(req.params.participante_id, function(err, r) {
	    req.participante = r;
	    next();
	});
    }

    function getEvaluacion(req, res, next) {
	var Evaluacion = app.db.model('Evaluacion');
	Evaluacion.findOne({
	    participante_id: req.params.participante_id,
	    taller_id: req.params.taller_id
	}, function(err, r) {
	    req.evaluacion = r;
	    next();
	});
    }

    function getCreativo(req, res, next) {
	var Creativo = app.db.model('Creativo');
	Evaluacion.findOne(req.session.creativo_id, function(err, r) {
	    req.creativo = r;
	    next();
	});
    }

    /*
     * JSON
     */
    app.get('/evaluaciones.json', getEvaluaciones, function(req, res) {
        res.send(req.evaluaciones);
    });
    
    app.get('/evaluaciones/:id.json', getEvaluaciones, function(req, res) {
        res.send(req.evaluacion);
    });
    
    app.post('/evaluaciones', postEvaluaciones, function(req, res) {
        res.send(req.evaluacion, 201);
    });

    app.put('/evaluaciones/:id', putEvaluaciones, function(req, res) {
        if (req.error) res.send({ 'error': true }, 500);
        else res.send({ 'ok': true });
    });

    app.del('/evaluaciones/:id', delEvaluaciones, function(req, res) {
        res.send({ 'ok': true });
    });

    /*
     * HTML
     */
    app.get('/taller/:taller_id/participante/:participante_id/evaluacion', getEvaluacion, getSesion, getParticipante, getCreativo, function(req, res) {
        res.render('forms/eval_participante', {
            locals: {
		evaluacion: req.evaluacion,
                params: app.params,
                participante: req.participante,
                creativo: req.creativo,
                taller: req.sesion,
                articulo: 'FormEvaluacion'
            }
        });
    });

    // app.get('/evaluaciones/new', getEvaluaciones, function(req, res) {
    //     var error_text = "";
    //     var render_error=function(err, status_code) {
    //         res.render('error', {
    //                 locals: {
    //                   status: status_code,
    //                   error_text: err
    //                 }
    //               });
    //         return;
    //     } 
    //     var taller_id = req.query['taller'];
    //     console.log(taller_id);
    //     var participante_id = req.query['p'];
    //     //debug
    //     //var participante_id = "503b0a155531839027000001";
    //     if (taller_id == null || taller_id == 'undefined') {
    //       render_error("ID taller invalido! Ese taller no fue encontrado.", 404);
    //       return;
    //     }
    //     Taller.findById(taller_id, function(err, taller) {
    //       if (err) {
    //         render_error("No fui capable de econtrar el taller deseado.", 404);
    //         return;
    //       }
    //       console.log(taller);
    //       Creativo.find({email: app.login_email}, function(err, creativo) { 
    //         if (err) {
    //           render_error("No fui capaz de encontrar el Creativo relacionado al usuário en sesión",500);
    //           return;
    //         }
    //         console.log(creativo);
    //         Participante.findOne({_id: participante_id}, function(err, participante) {
    //           if (err) {
    //             render_error("No fui capaz de encontrar el participante de la evaluación", 500);
    //             return;
    //           } else {
    //             console.log(participante);
    //             res.render('forms/eval_participante', {
    //               locals: {
    //                 params: app.params,
    //                 participante: participante,
    //                 creativo: creativo[0],
    //                 taller: taller,
    //                 articulo: 'FormEvaluacion'
    //               }
    //           });
    //          }
    //         });
    //       });
    //     });    
    // });
    
    app.get('/evaluaciones/:id', getEvaluaciones, function(req, res) {
        res.render('evaluacion', {
            locals: {
                evaluacion: req.evaluacion
            }
        });
    });
}

module.exports = Service;
