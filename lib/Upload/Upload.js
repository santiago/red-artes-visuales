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

    return function multipart(req, res, next) {
        if (req._body) return next();
        req.body = req.body || {};
        req.files = req.files || {};
                
        var setup = req.upload; 
        var filename = setup.filename || '';
        var path = setup.path || '';
        var resize = setup.resize || [];

        // ignore GET
        if ('GET' == req.method || 'HEAD' == req.method) return next();

        // check Content-Type
        if ('multipart/form-data' != utils.mime(req)) return next();

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
                
                //filename = part.filename ? part.filename : filename;
                this._flushing++;

                if (!part.filename) return this.handlePart(part);
                
                var ext = '.'+part.filename.split('.').pop();
                filename = filename ? filename+ext : part.filename;
                

                var bufferList = [];
                var bufferLength = 0;
                var lastLength = 0;
                                
                resize.forEach(function(l) {
                    doResize(l);
                });
                
                function doResize(l) {
                    gm(part).resize(l, l).stream(function(err, stdout, stderr) {                        
                        var thumbBufferList = [];
                        var thumbBufferLength = 0;
                        var thumbLastLength = 0;
                        var objectName = (path ? path+'/' : '')+l+'-'+filename;
                    
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
                        // Write file to FS
                        // stdout.pipe(fs.createWriteStream(Date.now() + '_' + part.filename));
                    });
                }
                
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

                    var meta = {}
                    s3PutObject(part.filename, uploadBuffer, meta, function() {
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
                next(err);
                done = true;
            });

            form.on('end', function() {
                if (done) return;
                try {
                    req.body = qs.parse(data);
                    req.file = filename;
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