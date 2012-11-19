var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var S3 = awssum.load('amazon/s3').S3;

var s3 = new S3({
    'accessKeyId' : 'AKIAJJZIDQNEG56DIZPQ',
    'secretAccessKey' : '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',
    'region' : amazon.US_EAST_1
});

module.exports = s3;