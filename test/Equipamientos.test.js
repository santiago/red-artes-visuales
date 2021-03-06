require('should');
var assert = require("assert")
var request = require('superagent')
var fixtures = require('./fixtures');

var host = 'http://localhost:6060';

var app = require('../server');
var db = app.db;


describe('Equipamientos', function() {
    describe('ReST', function() {
        var id;
        var Equipamiento = db.model('Equipamiento');
        
        before(function(done) {
            fixtures.Equipamientos.forEach(function(r) {
                (new Equipamiento(r)).save(function(err, data) {
                    id = data._id.toString();
                    done();
                });
            });
        })
        
        after(function(done) {
            Equipamiento.remove({}, function() {
                done();
            });
        })

        it('should GET by id', function(done) {
            request
                .get(host+'/equipamientos/'+id+'.json')
                .end(function(res) {
                    res.body._id.toString().should.equal(id);
                    res.should.be.json;
                    done();
                })
        })
        
        it('should GET all', function(done) {
            request
                .get(host+'/equipamientos.json')
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })

        it('should GET by query', function(done) {
            request
                .get(host+'/equipamientos.json')
                .send({
                    nombre: 'Casa Tres Patios'
                })
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0].nombre.should.equal('Casa Tres Patios');
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })
        
        it('should POST', function(done) {
            var data = fixtures.Equipamientos[0];
            request
                .post(host+'/equipamientos')
                .send(data)
                .end(function(res) {
                    res.should.be.json;
                    res.body.nombre.should.equal(data.nombre);
                    done();
                })
        })
        
        it('should PUT', function(done) {
            request
                .put(host+'/equipamientos/'+id)
                .send({ contacto: 'Tony' })
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })

        it('should DELETE', function(done) {
            request
                .del(host+'/equipamientos/'+id)
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })
    })
})