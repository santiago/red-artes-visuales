/*!
 * Connect - multipart
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var formidable = require('formidable'),
    _limit = require('./limit'),
    utils = require('./utils'),
    qs = require('qs'),
    fs = require('fs'),
    gm = require('gm')


/**
 * noop middleware.
 */

function noop(req, res, next) {
    next();
}

var db = require('../../models/models');
var s3 = require('./s3config');

var bucket = 'red-artes-visuales';

function s3CompleteMultipartUpload(name, uploadId, parts) {
    var options = {
        BucketName : bucket,
        ObjectName : name,
        UploadId : uploadId,
        Parts : parts
    };

    s3.CompleteMultipartUpload(options, function(err, data) {
        console.log(err);
        console.log(data);
    });
}

function s3InitiateMultipartUpload(name, callback) {
    var options = {
        BucketName : bucket,
        ObjectName : name
    };

    s3.InitiateMultipartUpload(options, callback);
};

function s3UploadPart(name, id, body, parts, callback) {
    var part;
    part = parts[parts.length] = {};
    part['PartNumber'] = parts.length;
    
    var params = {
        BucketName    : bucket,
        ObjectName    : name,
        Body          : body,
        ContentLength : body.length,
        PartNumber    : parts.length,
        UploadId      : id
    };
    
    s3.UploadPart(params, function(err, data) {
        part['ETag'] = data.Headers.etag;
        callback(err, data)
    });
}

function s3PutObject(name, body, metadata, callback) {
    var options = {
        BucketName    : bucket,
        ObjectName    : name,
        ContentLength : body.length,
        Body          : body,
        Acl           : 'public-read'
    };
    
    if (typeof metadata == 'object') {
        options['Metadata'] = metadata
    } else if (typeof metadata == 'function') {
        callback = metadata;
    } else {
        return
    }
    
    s3.PutObject(options, function(err, data) {
        callback()
    });
}

/**
 * Multipart:
 * 
 * Parse multipart/form-data request bodies,
 * providing the parsed object as `req.body`
 * and `req.files`.
 *
 * Configuration:
 *
 *  The options passed are merged with [formidable](https://github.com/felixge/node-formidable)'s
 *  `IncomingForm` object, allowing you to configure the upload directory,
 *  size limits, etc. For example if you wish to change the upload dir do the following.
 *
 *     app.use(connect.multipart({ uploadDir: path }));
 *
 * Options:
 *
 *   - `limit`  byte limit defaulting to none
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function(options) {
    options = options || {};

    var limit = options.limit ? _limit(options.limit) : noop;
    
    var Taller = db.model('Taller');

    return function multipart(req, res, next) {
        if (req._body) return next();
        req.body = req.body || {};
        req.files = req.files || {};
        
        console.log('111111\n\n\n')

        var taller_id = req.params.taller_id;

        // ignore GET
        if ('GET' == req.method || 'HEAD' == req.method) return next();

        // check Content-Type
        if ('multipart/form-data' != utils.mime(req)) return next();


        console.log('222222\n\n\n')
        
        // flag as parsed
        req._body = true;

        // parse
        limit(req, res, function(err) {
            if (err) return next(err);

            var form = new formidable.IncomingForm,
                data = {},
                files = {},
                done;

            Object.keys(options).forEach(function(key) {
                form[key] = options[key];
            });

            form.onPart = function(part) {
                var self = this;
                
                console.log('part')
                
                this._flushing++;

                if (!part.filename) return this.handlePart(part);

                var bufferList = [];
                var bufferLength = 0;
                var lastLength = 0;
                                
                gm(part).resize(150, 150).stream(function(err, stdout, stderr) {                        
                    var thumbBufferList = [];
                    var thumbBufferLength = 0;
                    var thumbLastLength = 0;
                    var objectName = '150-'+part.filename;
                    
                    stdout.on('data', function(buffer) {
                        thumbBufferLength += buffer.length;
                        thumbBufferList.push(buffer);
                    });
                    
                    stdout.on('end', function() {
                        var uploadBuffer = new Buffer(thumbBufferLength);
                        thumbBufferList.forEach(function(buf) {
                            buf.copy(uploadBuffer, thumbLastLength);
                            thumbLastLength += buf.length;
                        })
                        s3PutObject(objectName, uploadBuffer, function() {
                            self._flushing--;
                            self._maybeEnd();
                            
                        });
                    })
                    // stdout.pipe(fs.createWriteStream(Date.now() + '_' + part.filename));
                });
                
                part.on('data', function(buffer) {
                    bufferLength += buffer.length;
                    bufferList.push(buffer);
                });

                part.on('end', function() {
                    var uploadBuffer = new Buffer(bufferLength);
                    bufferList.forEach(function(buf) {
                        buf.copy(uploadBuffer, lastLength);
                        lastLength += buf.length;
                    })

                    var meta = { taller_id: taller_id }

                    console.log('3333333\n\n\n')

                    s3PutObject(part.filename, uploadBuffer, meta, function() {
                        Taller.findById(taller_id, function(err, taller) {
                            var media = {
                                type: '',
                                format: '',
                                name: part.filename,
                                creativo_cedula: req.user.cedula,
                                fecha: new Date
                            }
                            console.log('3333333\n\n\n')
                            taller.get('media').push(media);
                            taller.save(function(err, obj) {
                                console.log(obj)
                            })
                        })
                        self._flushing--;
                        self._maybeEnd();
                    });
                });
            };

            function ondata(name, val, data) {
                console.log('ondata\n\n\n')
                if (Array.isArray(data[name])) {
                    data[name].push(val);
                }
                else if (data[name]) {
                    data[name] = [data[name], val];
                }
                else {
                    data[name] = val;
                }
            }

            form.on('field', function(name, val) {
                ondata(name, val, data);
            });

            form.on('error', function(err) {
                err.status = 400;
                console.log('quiii')
                console.log(err)
                next(err);
                done = true;
            });

            form.on('end', function() {
                if (done) return;
                try {
                    req.body = qs.parse(data);
                    next();
                }
                catch (err) {
                    next(err);
                }
            });

            form.parse(req);
        });
    }
};