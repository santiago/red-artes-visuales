require('should');
var assert = require("assert")
var request = require('superagent')
var fixtures = require('./fixtures');

var host = 'http://localhost:6060';

var app = require('../server');
var db = app.db;


describe('Participantes', function() {
    describe('ReST', function() {
        var id;
        var Participante = db.model('Participante');
        
        before(function(done) {
            fixtures.Participantes.forEach(function(r) {
                (new Participante(r)).save(function(err, data) {
		    id = data._id.toString();
                    done();
                });
            });
        })
        
        after(function(done) {
            Participante.remove({}, function() {
                done();
            });
        })

        it('should GET by id', function(done) {
            request
                .get(host+'/participantes/'+id+'.json')
                .end(function(res) {
                    res.body._id.toString().should.equal(id);
                    res.should.be.json;
                    done();
                })
        })
        
        it('should GET all', function(done) {
            request
                .get(host+'/participantes.json')
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })

        it('should GET by query', function(done) {
            request
                .get(host+'/participantes.json')
                .send({
                    nombre: 'Juan Alberto Castaño'
                })
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0].nombre.should.equal('Juan Alberto Castaño');
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })
        
        it('should POST', function(done) {
            var data = fixtures.Participantes[0];
            request
                .post(host+'/participantes')
                .send(data)
                .end(function(res) {
                    res.should.be.json;
                    res.body.nombre.should.equal(data.nombre);
                    done();
                })
        })
        
        it('should PUT', function(done) {
            request
                .put(host+'/participantes/'+id)
                .send({ contacto: 'Tony' })
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })

        it('should DELETE', function(done) {
            request
                .del(host+'/participantes/'+id)
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })
    })
})
