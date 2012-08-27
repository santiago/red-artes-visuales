require('should');
var assert = require("assert")
var request = require('superagent')
var fixtures = require('./fixtures');

var host = 'http://localhost:6060';

var app = require('../server');
var db = app.db;


describe('Talleres', function() {
    describe('TallerBase', function() {
	describe('ReST', function() {
	})
    })
    
    describe('ReST', function() {
        var id;
        var Taller = db.model('Taller');
        
        before(function(done) {
            fixtures.Talleres.forEach(function(r) {
                (new Taller(r)).save(function(err, data) {
                    id = data._id.toString();
                    done();
                });
            });
        })
        
        after(function(done) {
            Taller.remove({}, function() {
                done();
            });
        })

        it('should GET by id', function(done) {
            request
                .get(host+'/talleres/'+id+'.json')
                .end(function(res) {
		    console.log(res.body._id);
                    res.body._id.toString().should.equal(id);
                    res.should.be.json;
                    done();
                })
        })
        
        it('should GET all', function(done) {
            request
                .get(host+'/talleres.json')
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })

        it('should GET by query', function(done) {
            request
                .get(host+'/talleres.json')
                .send({
                    nombre: 'Circuit Bending'
                })
                .end(function(res) {
                    res.should.be.json;
                    res.body.should.have.length(1);
                    res.body[0].nombre.should.equal('Circuit Bending');
                    res.body[0]._id.toString().should.equal(id);
                    done();
                })
        })
        
        it('should POST', function(done) {
            var data = fixtures.Talleres[0];
            request
                .post(host+'/talleres')
                .send(data)
                .end(function(res) {
                    res.should.be.json;
                    res.body.nombre.should.equal(data.nombre);
                    done();
                })
        })
        
        it('should PUT', function(done) {
            request
                .put(host+'/talleres/'+id)
                .send({ objetivos: 'Pasarla bien' })
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })

        it('should DELETE', function(done) {
            request
                .del(host+'/talleres/'+id)
                .end(function(res) {
                    res.should.be.json;
                    done();
                })
        })
    })
})
