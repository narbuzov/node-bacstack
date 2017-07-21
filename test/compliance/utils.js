var child_process = require('child_process');
var path          = require('path');
var bacnet        = require('../../');

var basePath = process.env.BACNET_STACK_PATH || '../../bacnet-stack-0.8.4/bin';

var simulatorPath       = path.join(basePath, 'bacserv');
var whoisPath           = path.join(basePath, 'bacwi');
var readpropertyPath    = path.join(basePath, 'bacrp');

var serverProcess;

module.exports.readProperty = function(next) {
  child_process.execSync(readpropertyPath, []);
};

module.exports.startServer = function() {
  serverProcess = child_process.exec(simulatorPath, ['123'], function(err, stdout, stderr) {
    console.log(err);
    console.log(stdout);
    console.log(stderr);
  });
};

module.exports.stopServer = function() {
  serverProcess.kill();
};

module.exports.bacnetClient = bacnet;
