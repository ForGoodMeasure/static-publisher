var async = require('async');
var aws = require('aws-sdk');
var apiGatewayRequest = require('./api-gateway-request.js');
var assert = require('assert');

/*
 * For each path, download HTML markup
 */
function getMarkup(opts, callback) {
  var lambda = new aws.Lambda({ region: opts.packageConfig.lambdaRegion });
  async.parallelLimit(
    opts.routes.map(path => cb => lambda.invoke({
      FunctionName: opts.packageConfig.lambdaFunctionName,
      Payload: JSON.stringify(apiGatewayRequest({path}))
    }, (err, res) => {
      if (err) {
        return cb(err);
      }
      cb(null, {
        statusCode: res.StatusCode,
        markup: res.StatusCode === 200 && JSON.parse(res.Payload).body,
        path
      });
    })),
    3,
    callback
  );
}

/*
 * Given an array of html, save them to S3
 */
function writeMarkup(opts, markup, callback) {
  var s3 = new aws.S3();
  async.parallelLimit(
    markup.map(item => cb => s3.putObject({
      Body: item.markup,
      Bucket: opts.packageConfig.s3BucketName,
      Key: item.path === '/' ? 'index.html' : item.path.substr(1),
      ACL: 'public-read',
      ContentType: 'text/html'
    }, cb)),
    3,
    callback
  );
}

exports.handler = (event, context, callback) => {
  const {routes, packageConfig, stageContext} = event;

  assert.ok(
    Array.isArray(routes),
    'Routes should be an array'
  );
  assert.ok(
    packageConfig.lambdaFunctionName,
    'packageConfig.lambdaFunctionName should be defined'
  );
  assert.ok(
    packageConfig.s3BucketName,
    'packageConfig.s3BucketName should be defined'
  );
  assert.ok(
    packageConfig.lambdaRegion,
    'packageConfig.lambdaRegion should be defined'
  );

  async.waterfall([
    cb => getMarkup({packageConfig, routes}, cb),
    (markup, cb) => writeMarkup({packageConfig}, markup, cb)
  ], (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  });

};
