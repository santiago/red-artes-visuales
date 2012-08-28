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
          console.log("++++++++++++");
          console.log(key);
          console.log(key.substring(0,2));
          if (key.substring(0,2) == 'i_') {
            console.log("-----------+");
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
    app.get('/evaluaciones/new', getEvaluaciones, function(req, res) {
        var error_text = "";
        var render_error=function(err) {
            res.render('error', {
                    locals: {
                      error_text: err
                    }
                  });
            return;
        } 
        var taller_id = req.query['taller'];
        console.log(taller_id);
        var participante_id = req.query['p'];
        //debug
        var participante_id = "503b0a155531839027000001";
        if (taller_id == null || taller_id == 'undefined') {
          render_error("taller_id invalido");
          return;
        }
        Taller.findById(taller_id, function(err, taller) {
          if (err) {
            render_error("error finding taller");
            return;
          }
          console.log(taller);
          if (taller.actividad_id == null) {
            error_text = "taller invalido";
            render_error(error_text);  
            return;
          }
          TallerBase.findById(taller.actividad_id, function(err, taller_base) {
            Creativo.find({email: app.login_email}, function(err, creativo) { 
              console.log(creativo);
              Participante.findOne({_id: participante_id}, function(err, participante) {
                if (err || error_text != "") {
                  render_error(error_text);
                } else {
                  res.render('forms/eval_participante', {
                    locals: {
                      taller_base: taller_base,
                      params: app.params,
                      participante: participante,
                      creativo: creativo[0],
                      taller: taller,
                      articulo: 'FormEvaluacion'
                    }
                });
               }
              });
            });
          });
        });    
    });
    
    app.get('/evaluaciones/:id', getEvaluaciones, function(req, res) {
        res.render('evaluacion', {
            locals: {
                evaluacion: req.evaluacion
            }
        });
    });
}

module.exports = Service;
