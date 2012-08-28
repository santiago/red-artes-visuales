function Service(app) {
    var Creativo = app.db.model('Creativo');
    var Usuario = app.db.model('Usuario');
    var TallerBase = app.db.model('TallerBase');
    var Taller = app.db.model('Taller');
    var Evaluacion = app.db.model('Evaluacion');
    
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
            Creativo.find(query, function(err, records) {
                req.creativos = records;
                next();
            });
        }
    }
  
    function getTaller_Bases(req,res,next) {
      var query = (function() {
        if (req.params.id) {
          return {_id: req.params.id}
        }
        if (req.query) {
          return req.query;
        }
        return{};
      })();

      if(query._id) {
        TallerBase.findOne(query, function(err, r) {
          req.taller_base = record;
          next();
        });
      } else {
        Taller.find(query, function(err, talleres) {
          req.talleres = talleres;
          var id_array = new Array();
          req.talleres.forEach(function(item,index) {
            id_array[index] = item.actividad_id;
          });
          TallerBase.find({'_id': { $in: id_array}}, function(err, records) {
            req.taller_bases = records;
            checkInfoProvided(req.taller_bases, req);
            next();
          });
        });
      }
    }

    function checkInfoProvided(taller_bases, req) {
      var info_provided = new Array();
      for (var i=0; i<taller_bases.length; i++) {
        info_provided[i] = i%2;
      }
      req.talleres_info_provided = info_provided;
    }   

    function postCreativos(req, res, next) {
        var crypto = require('crypto');
        var crypt_key = app.crypt_key;
        var data = req.body;
        var model = new Creativo(data);
        var default_passwd = req.body.cedula;
        var hashed_default_passwd = crypto.createHmac('sha1', crypt_key).update(default_passwd).digest('hex');
        var user = new Usuario({email: req.body.email,rol:'creativo',cedula: req.body.cedula,contrasena: hashed_default_passwd});
        user.save(function(err, u) {
          if (err) {
            throw err;
          }
          model.save(function(err, r) {
            if (err) {
              throw err;
            }
            req.creativo = r;
            next();
          });
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
        res.render('admin/creativo', {
            locals: {
          		articulo: 'FormCreativo',
		          params: app.params
	          }
        });
    });
    
    app.get('/admin/creativos/:id', getCreativos, function(req, res) {
        res.render('admin/creativo', {
            locals: {
                creativo: req.creativo
            }
        });
    });

    app.get('/admin/monitor',getTaller_Bases, function(req,res) {
      res.render('admin/monitor', {
        locals: {
          taller_bases: req.taller_bases,
          talleres_info_provided: req.talleres_info_provided
        }
      });
    }); 
}

module.exports = Service;
