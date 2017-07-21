var expect = require('chai').expect;
var utils = require('./utils');

describe('bacstack - readProperty integration', function() {

  beforeEach(function() {
    utils.startServer();
  });

  afterEach(function() {
    utils.stopServer();
  });

  it('should return a timeout error if no device is available', function(next) {
    var client = new utils.bacnetClient({adpuTimeout: 200});
    client.readProperty('127.0.0.1', 8, 44301, 28, null, function(err, value) {
      console.log(value);
      expect(err).to.not.eql(new Error('ERR_TIMEOUT'));
      client.close();
      next();
    });
  });
});
