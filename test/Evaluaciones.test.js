require('should');
var assert = require("assert")
var request = require('superagent')
var fixtures = require('./fixtures');

var host = 'http://localhost:6060';

var app = require('../server');
var db = app.db;


describe('Evaluaciones', function() {
    describe('ReST', function() {
        var id;
        var Evaluacion = db.model('Evaluacion');
        
        before(function(done) {
            fixtures.Evaluaciones.forEach(function(r) {
                (new Evaluacion(r)).save(function(err, data) {
                    id = data._id.toString();
                    done();
                });
            });
        })
        
        after(function(done) {
            Evaluacion.remove({}, function() {
                done();
            });
        })

        it('should GET by id', function(done) {
            request
                .get(host+'/evaluaciones/'+id+'.json')
                .end(function(res) {
                    res.body._id.toString().should.equal(id);
                    res.should.be.json;
                    done();
                })
        })
        
        it('should GET all', function(done) {
            request
                .get(host+'/evaluaciones.json')
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })

        it('should GET by query', function(done) {
            request
                .get(host+'/evaluaciones.json')
                .send({
                    creativo: 'Ese man'
                })
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0].creativo.should.equal('Ese man');
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })
        
        it('should POST', function(done) {
            var data = fixtures.Evaluaciones[0];
            request
                .post(host+'/evaluaciones')
                .send(data)
                .end(function(res) {
                    res.should.be.json;
                    res.body.creativo.should.equal(data.creativo);
                    done();
                })
        })
        
        it('should PUT', function(done) {
            request
                .put(host+'/evaluaciones/'+id)
                .send({ taller: 'Circuit Bending' })
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })

        it('should DELETE', function(done) {
            request
                .del(host+'/evaluaciones/'+id)
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })
    })
})
