var expect        = require('chai').expect;
var utils         = require('./utils');
var baServices    = require('../../lib/bacnet-services');
var baEnum        = require('../../lib/bacnet-enum');

describe('bacstack - Services layer', function() {
  describe('Iam', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeIamBroadcast(buffer, 47, 1, 1, 7);
      var result = baServices.decodeIamBroadcast(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        deviceId: 47,
        maxApdu: 1,
        segmentation: 1,
        vendorId: 7
      });
    });
  });

  describe('WhoHas', function() {
    it('should successfully encode and decode by id', function() {
      var buffer = utils.getBuffer();
      baServices.encodeWhoHasBroadcast(buffer, 3, 4000, {type: 3, instance: 15});
      var result = baServices.decodeWhoHasBroadcast(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        lowLimit: 3,
        highLimit: 4000,
        objectId: {
          type: 3,
          instance: 15
        }
      });
    });

    it('should successfully encode and decode by name', function() {
      var buffer = utils.getBuffer();
      baServices.encodeWhoHasBroadcast(buffer, 3, 4000, {}, 'analog-output-1');
      var result = baServices.decodeWhoHasBroadcast(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        lowLimit: 3,
        highLimit: 4000,
        objectName: 'analog-output-1'
      });
    });
  });

  describe('WhoIs', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeWhoIsBroadcast(buffer, 1, 3000);
      var result = baServices.decodeWhoIsBroadcast(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        lowLimit: 1,
        highLimit: 3000
      });
    });
  });

  describe('ReadPropertyAcknowledge', function() {
    it('should successfully encode and decode a boolean value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 1, value: true},
        {type: 1, value: false}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 1, value: true},
          {type: 1, value: false}
        ]
      });
    });

    it('should successfully encode and decode a boolean value with array index', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 2, [
        {type: 1, value: true}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 2,
          id: 81
        },
        values: [
          {type: 1, value: true}
        ]
      });
    });

    it('should successfully encode and decode an unsigned value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 2, value: 1},
        {type: 2, value: 1000},
        {type: 2, value: 1000000},
        {type: 2, value: 1000000000}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 2, value: 1},
          {type: 2, value: 1000},
          {type: 2, value: 1000000},
          {type: 2, value: 1000000000}
        ]
      });
    });

    it('should successfully encode and decode a signed value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 3, value: -1},
        {type: 3, value: -1000},
        {type: 3, value: -1000000},
        {type: 3, value: -1000000000}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 3, value: -1},
          {type: 3, value: -1000},
          {type: 3, value: -1000000},
          {type: 3, value: -1000000000}
        ]
      });
    });

    it('should successfully encode and decode an real value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 4, value: 0},
        {type: 4, value: 0.1}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(Math.floor(0.1 * 10000)).to.equal(Math.floor(result.values[1].value * 10000));
      result.values[1].value = 0;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 4, value: 0},
          {type: 4, value: 0}
        ]
      });
    });

    it('should successfully encode and decode a double value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 5, value: 0},
        {type: 5, value: 100.121212}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 5, value: 00},
          {type: 5, value: 100.1212120}
        ]
      });
    });

    it('should successfully encode and decode an octet-string value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 6, value: []},
        {type: 6, value: [1, 2, 100, 200]}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 6, value: []},
          {type: 6, value: [1, 2, 100, 200]}
        ]
      });
    });

    it('should successfully encode and decode a character-string value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 7, value: ''},
        {type: 7, value: 'Test1234$äöü'}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 7, value: '', encoding: 0},
          {type: 7, value: 'Test1234$äöü', encoding: 0}
        ]
      });
    });

    it('should successfully encode and decode a character-string value with ISO-8859-1 encoding', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_ISO8859_1},
        {type: 7, value: 'Test1234$äöü', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_ISO8859_1}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_ISO8859_1},
          {type: 7, value: 'Test1234$äöü', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_ISO8859_1}
        ]
      });
    });

    it('should successfully encode and decode a character-string value with UCS2 encoding', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_UCS2},
        {type: 7, value: 'Test1234$äöü', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_UCS2}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_UCS2, len: 2},
          {type: 7, value: 'Test1234$äöü', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_UCS2, len: 27}
        ]
      });
    });

    it('should successfully encode and decode a character-string value with Codepage850 encoding', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_MS_DBCS},
        {type: 7, value: 'Test1234$äöü', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_MS_DBCS}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_MS_DBCS, len: 2},
          {type: 7, value: 'Test1234$äöü', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_MS_DBCS, len: 15}
        ]
      });
    });

    it('should successfully encode and decode a character-string value with JISX-0208 encoding', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_JISX_0208},
        {type: 7, value: 'できます', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_JISX_0208}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          propertyArrayIndex: 0xFFFFFFFF,
          propertyIdentifier: 81
        },
        valueList: [
          {type: 7, value: '', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_JISX_0208, len: 2},
          {type: 7, value: 'できます', encoding: baEnum.BacnetCharacterStringEncodings.CHARACTER_JISX_0208, len: 11}
        ]
      });
    });

    it('should successfully encode and decode a bit-string value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 8, value: [], bitsUsed: 0},
        {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 8, value: [], bitsUsed: 0},
          {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24}
        ]
      });
    });

    it('should successfully encode and decode a enumeration value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 9, value: 0},
        {type: 9, value: 4}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 9, value: 0},
          {type: 9, value: 4}
        ]
      });
    });

    it('should successfully encode and decode a date value', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 10, value: date}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 10, value: date}
        ]
      });
    });

    it('should successfully encode and decode a time value', function() {
      var buffer = utils.getBuffer();
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 11, value: time}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 11, value: time}
        ]
      });
    });

    it('should successfully encode and decode a object-identifier value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 8, instance: 40000}, 81, 0xFFFFFFFF, [
        {type: 12, value: {type: 3, instance: 0}},
        {type: 12, value: {type: 3, instance: 50000}}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 8,
          instance: 40000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 81
        },
        values: [
          {type: 12, value: {type: 3, instance: 0}},
          {type: 12, value: {type: 3, instance: 50000}}
        ]
      });
    });

  // TODO: Rework
    it('should successfully encode and decode a cov-subscription value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 222, instance: 3}, 152, 0xFFFFFFFF, [
        {type: 111, value: {
          recipient: {net: 12, address: [0, 1]},
          subscriptionProcessIdentifier: 3,
          objectId: {type: 2, instance: 1},
          property: {id: 85, index: 0},
          isConfirmed: false,
          timeRemaining: 5,
          covIncrement: 1
        }},
        {type: 111, value: {
          recipient: {net: 0xFFFF, address: []},
          subscriptionProcessIdentifier: 3,
          objectId: {type: 2, instance: 1},
          property: {id: 85, index: 5},
          isConfirmed: true,
          timeRemaining: 5
        }}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 222,
          instance: 3
        },
        property: {
          index: 0xFFFFFFFF,
          id: 152
        },
        values: [
          {type: 111, value: {
            recipient: {net: 12, address: [0, 1]},
            subscriptionProcessIdentifier: 3,
            objectId: {type: 2, instance: 1},
            property: {id: 85, index: 0},
            isConfirmed: false,
            timeRemaining: 5,
            covIncrement: 1
          }},
          {type: 111, value: {
            recipient: {net: 0xFFFF, address: []},
            subscriptionProcessIdentifier: 3,
            objectId: {type: 2, instance: 1},
            property: {id: 85, index: 5},
            isConfirmed: true,
            timeRemaining: 5
          }}
        ]
      });
    });

    it('should successfully encode and decode a read-access-specification value', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyAcknowledge(buffer, {type: 223, instance: 90000}, 53, 0xFFFFFFFF, [
        {type: 115, value: {objectId: {type: 3, instance: 0}, properties: []}},
        {type: 115, value: {objectId: {type: 3, instance: 50000}, properties: [
          {id: 85},
          {id: 1, index: 2}
        ]}}
      ]);
      var result = baServices.decodeReadPropertyAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 223,
          instance: 90000
        },
        property: {
          index: 0xFFFFFFFF,
          id: 53
        },
        values: [
          {type: 115, value: {objectId: {type: 3, instance: 0}, properties: []}},
          {type: 115, value: {objectId: {type: 3, instance: 50000}, properties: [
            {id: 85, index: 0xFFFFFFFF},
            {id: 1, index: 2}
          ]}}
        ]
      });
    });
  });

  describe('ReadPropertyMultipleAcknowledge', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeReadPropertyMultipleAcknowledge(buffer, [
        {objectId: {type: 9, instance: 50000}, values: [
          {property: {id: 81, index: 0xFFFFFFFF}, values: [
            {type: 1, value: true},
            {type: 1, value: false},
            {type: 2, value: 1},
            {type: 2, value: 1000},
            {type: 2, value: 1000000},
            {type: 2, value: 1000000000},
            {type: 3, value: -1},
            {type: 3, value: -1000},
            {type: 3, value: -1000000},
            {type: 3, value: -1000000000},
            {type: 4, value: 0.1},
            {type: 5, value: 100.121212},
            {type: 6, value: [1, 2, 100, 200]},
            {type: 7, value: 'Test1234$'},
            {type: 8, value: [], bitsUsed: 0},
            {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
            {type: 9, value: 4},
            {type: 10, value: date},
            {type: 11, value: time},
            {type: 12, value: {type: 3, instance: 0}}
          ]}
        ]}
      ]);
      var result = baServices.decodeReadPropertyMultipleAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(Math.floor(0.1 * 10000)).to.equal(Math.floor(result.values[0].values[0].values[10].value * 10000));
      result.values[0].values[0].values[10].value = 0;
      expect(result).to.deep.equal({
        values: [{
          objectId: {
            type: 9,
            instance: 50000
          },
          values: [{
            property: {
              index: 4294967295,
              id: 81,
            },
            values: [
              {type: 1, value: true},
              {type: 1, value: false},
              {type: 2, value: 1},
              {type: 2, value: 1000},
              {type: 2, value: 1000000},
              {type: 2, value: 1000000000},
              {type: 3, value: -1},
              {type: 3, value: -1000},
              {type: 3, value: -1000000},
              {type: 3, value: -1000000000},
              {type: 4, value: 0},
              {type: 5, value: 100.121212},
              {type: 6, value: [1, 2, 100, 200]},
              {type: 7, value: 'Test1234$', encoding: 0},
              {type: 8, value: [], bitsUsed: 0},
              {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
              {type: 9, value: 4},
              {type: 10, value: date},
              {type: 11, value: time},
              {type: 12, value: {type: 3, instance: 0}}
            ]
          }]
        }]
      });
    });
  });

  describe('WriteProperty', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeWriteProperty(buffer, 31, 12, 80, 0xFFFFFFFF, 0, [
        {type: 1, value: true},
        {type: 1, value: false},
        {type: 2, value: 1},
        {type: 2, value: 1000},
        {type: 2, value: 1000000},
        {type: 2, value: 1000000000},
        {type: 3, value: -1},
        {type: 3, value: -1000},
        {type: 3, value: -1000000},
        {type: 3, value: -1000000000},
        {type: 4, value: 0},
        {type: 5, value: 100.121212},
        {type: 7, value: 'Test1234$'},
        {type: 9, value: 4},
        {type: 10, value: date},
        {type: 11, value: time},
        {type: 12, value: {type: 3, instance: 0}}
      ]);
      var result = baServices.decodeWriteProperty(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          instance: 12,
          type: 31
        },
        values: {
          priority: 16,
          property: {
            index: 4294967295,
            id: 80
          },
          values: [
            {type: 1, value: true},
            {type: 1, value: false},
            {type: 2, value: 1},
            {type: 2, value: 1000},
            {type: 2, value: 1000000},
            {type: 2, value: 1000000000},
            {type: 3, value: -1},
            {type: 3, value: -1000},
            {type: 3, value: -1000000},
            {type: 3, value: -1000000000},
            {type: 4, value: 0},
            {type: 5, value: 100.121212},
            {type: 7, value: 'Test1234$', encoding: 0},
            {type: 9, value: 4},
            {type: 10, value: date},
            {type: 11, value: time},
            {type: 12, value: {type: 3, instance: 0}}
          ]
        }
      });
    });

    it('should successfully encode and decode with defined priority', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeWriteProperty(buffer, 31, 12, 80, 0xFFFFFFFF, 8, [
        {type: 1, value: true},
        {type: 1, value: false},
        {type: 2, value: 1},
        {type: 2, value: 1000},
        {type: 2, value: 1000000},
        {type: 2, value: 1000000000},
        {type: 3, value: -1},
        {type: 3, value: -1000},
        {type: 3, value: -1000000},
        {type: 3, value: -1000000000},
        {type: 4, value: 0},
        {type: 5, value: 100.121212},
        {type: 7, value: 'Test1234$'},
        {type: 9, value: 4},
        {type: 10, value: date},
        {type: 11, value: time},
        {type: 12, value: {type: 3, instance: 0}}
      ]);
      var result = baServices.decodeWriteProperty(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          instance: 12,
          type: 31
        },
        values: {
          priority: 8,
          property: {
            index: 4294967295,
            id: 80
          },
          values: [
            {type: 1, value: true},
            {type: 1, value: false},
            {type: 2, value: 1},
            {type: 2, value: 1000},
            {type: 2, value: 1000000},
            {type: 2, value: 1000000000},
            {type: 3, value: -1},
            {type: 3, value: -1000},
            {type: 3, value: -1000000},
            {type: 3, value: -1000000000},
            {type: 4, value: 0},
            {type: 5, value: 100.121212},
            {type: 7, value: 'Test1234$', encoding: 0},
            {type: 9, value: 4},
            {type: 10, value: date},
            {type: 11, value: time},
            {type: 12, value: {type: 3, instance: 0}}
          ]
        }
      });
    });

    it('should successfully encode and decode with defined array index', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeWriteProperty(buffer, 31, 12, 80, 2, 0, [
        {type: 1, value: true},
        {type: 1, value: false},
        {type: 2, value: 1},
        {type: 2, value: 1000},
        {type: 2, value: 1000000},
        {type: 2, value: 1000000000},
        {type: 3, value: -1},
        {type: 3, value: -1000},
        {type: 3, value: -1000000},
        {type: 3, value: -1000000000},
        {type: 4, value: 0},
        {type: 5, value: 100.121212},
        {type: 7, value: 'Test1234$'},
        {type: 9, value: 4},
        {type: 10, value: date},
        {type: 11, value: time},
        {type: 12, value: {type: 3, instance: 0}}
      ]);
      var result = baServices.decodeWriteProperty(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          instance: 12,
          type: 31
        },
        values: {
          priority: 16,
          property: {
            index: 2,
            id: 80
          },
          values: [
            {type: 1, value: true},
            {type: 1, value: false},
            {type: 2, value: 1},
            {type: 2, value: 1000},
            {type: 2, value: 1000000},
            {type: 2, value: 1000000000},
            {type: 3, value: -1},
            {type: 3, value: -1000},
            {type: 3, value: -1000000},
            {type: 3, value: -1000000000},
            {type: 4, value: 0},
            {type: 5, value: 100.121212},
            {type: 7, value: 'Test1234$', encoding: 0},
            {type: 9, value: 4},
            {type: 10, value: date},
            {type: 11, value: time},
            {type: 12, value: {type: 3, instance: 0}}
          ]
        }
      });
    });
  });

  describe('WritePropertyMultiple', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeWritePropertyMultiple(buffer, {type: 39, instance: 2400}, [
        {property: {id: 81, index: 0xFFFFFFFF}, value: [
          {type: 1, value: true},
          {type: 1, value: false},
          {type: 2, value: 1},
          {type: 2, value: 1000},
          {type: 2, value: 1000000},
          {type: 2, value: 1000000000},
          {type: 3, value: -1},
          {type: 3, value: -1000},
          {type: 3, value: -1000000},
          {type: 3, value: -1000000000},
          {type: 4, value: 0.1},
          {type: 5, value: 100.121212},
          {type: 6, value: [1, 2, 100, 200]},
          {type: 7, value: 'Test1234$'},
          {type: 8, value: [], bitsUsed: 0},
          {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
          {type: 9, value: 4},
          {type: 10, value: date},
          {type: 11, value: time},
          {type: 12, value: {type: 3, instance: 0}}
        ], priority: 0}
      ]);
      var result = baServices.decodeWritePropertyMultiple(buffer.buffer, 0, buffer.offset);
      delete result.len;
      result.values[0].values[10].value = Math.floor(result.values[0].values[10].value * 1000) / 1000;
      expect(result).to.deep.equal({
        objectId: {
          type: 39,
          instance: 2400
        },
        values: [
          {
            priority: 0,
            property: {
              index: 0xFFFFFFFF,
              id: 81
            },
            values: [
              {type: 1, value: true},
              {type: 1, value: false},
              {type: 2, value: 1},
              {type: 2, value: 1000},
              {type: 2, value: 1000000},
              {type: 2, value: 1000000000},
              {type: 3, value: -1},
              {type: 3, value: -1000},
              {type: 3, value: -1000000},
              {type: 3, value: -1000000000},
              {type: 4, value: 0.1},
              {type: 5, value: 100.1212120},
              {type: 6, value: [1, 2, 100, 200]},
              {type: 7, value: 'Test1234$', encoding: 0},
              {type: 8, value: [], bitsUsed: 0},
              {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
              {type: 9, value: 4},
              {type: 10, value: date},
              {type: 11, value: time},
              {type: 12, value: {type: 3, instance: 0}}
            ]
          }
        ]
      });
    });

    it('should successfully encode and decode with defined priority', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeWritePropertyMultiple(buffer, {type: 39, instance: 2400}, [
        {property: {id: 81, index: 0xFFFFFFFF}, value: [
          {type: 7, value: 'Test1234$'}
        ], priority: 12}
      ]);
      var result = baServices.decodeWritePropertyMultiple(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 39,
          instance: 2400
        },
        values: [
          {
            priority: 12,
            property: {
              index: 0xFFFFFFFF,
              id: 81
            },
            values: [
              {type: 7, value: 'Test1234$', encoding: 0}
            ]
          }
        ]
      });
    });

    it('should successfully encode and decode with defined array index', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeWritePropertyMultiple(buffer, {type: 39, instance: 2400}, [
        {property: {id: 81, index: 414141}, value: [
          {type: 7, value: 'Test1234$'}
        ], priority: 0}
      ]);
      var result = baServices.decodeWritePropertyMultiple(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {
          type: 39,
          instance: 2400
        },
        values: [
          {
            priority: 0,
            property: {
              index: 414141,
              id: 81
            },
            values: [
              {type: 7, value: 'Test1234$', encoding: 0}
            ]
          }
        ]
      });
    });
  });

  describe('DeviceCommunicationControl', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeDeviceCommunicationControl(buffer, 30, 1);
      var result = baServices.decodeDeviceCommunicationControl(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        timeDuration: 30,
        enableDisable: 1
      });
    });

    it('should successfully encode and decode with password', function() {
      var buffer = utils.getBuffer();
      baServices.encodeDeviceCommunicationControl(buffer, 30, 1, 'Test1234!');
      var result = baServices.decodeDeviceCommunicationControl(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        timeDuration: 30,
        enableDisable: 1,
        password: 'Test1234!'
      });
    });
  });

  describe('ReinitializeDevice', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReinitializeDevice(buffer, 5);
      var result = baServices.decodeReinitializeDevice(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        state: 5
      });
    });

    it('should successfully encode and decode with password', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReinitializeDevice(buffer, 5, 'Test1234$');
      var result = baServices.decodeReinitializeDevice(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        state: 5,
        password: 'Test1234$'
      });
    });
  });

  describe('TimeSync', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(990);
      baServices.encodeTimeSync(buffer, date);
      var result = baServices.decodeTimeSync(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        value: date
      });
    });
  });

  describe('Error', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeError(buffer, 15, 25);
      var result = baServices.decodeError(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        class: 15,
        code: 25
      });
    });
  });

  describe('ReadPropertyMultiple', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadPropertyMultiple(buffer, [
        {objectId: {type: 51, instance: 1}, properties: [
          {id: 85, index: 0xFFFFFFFF},
          {id: 85, index: 4}
        ]}
      ]);
      var result = baServices.decodeReadPropertyMultiple(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({values: [{objectId: {type: 51, instance: 1}, properties: [
        {id: 85, index: 0xFFFFFFFF},
        {id: 85, index: 4}
      ]}]});
    });
  });

  describe('SubscribeProperty', function() {
    it('should successfully encode and decode with cancellation request', function() {
      var buffer = utils.getBuffer();
      baServices.encodeSubscribeProperty(buffer, 7, {type: 148, instance: 362}, true, false, 1, {id: 85, index: 0xFFFFFFFF}, true, 1);
      var result = baServices.decodeSubscribeProperty(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        isCancellation: true,
        covIncrement: 1,
        isConfirmed: false,
        lifetime: 0,
        objectId: {
          instance: 362,
          type: 148
        },
        property: {
          index: 4294967295,
          id: 85
        },
        subscriberId: 7
      });
    });

    it('should successfully encode and decode without cancellation request', function() {
      var buffer = utils.getBuffer();
      baServices.encodeSubscribeProperty(buffer, 8, {type: 149, instance: 363}, false, true, 2, {id: 86, index: 3}, false, 10);
      var result = baServices.decodeSubscribeProperty(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        isCancellation: false,
        covIncrement: 0,
        isConfirmed: true,
        lifetime: 2,
        objectId: {
          instance: 363,
          type: 149
        },
        property: {
          index: 3,
          id: 86
        },
        subscriberId: 8
      });
    });
  });

  describe('SubscribeCOV', function() {
    it('should successfully encode and decode a cancelation request', function() {
      var buffer = utils.getBuffer();
      baServices.encodeSubscribeCOV(buffer, 10, {type: 3, instance: 1}, true);
      var result = baServices.decodeSubscribeCOV(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        isCancellation: true,
        objectId: {type: 3, instance: 1},
        subscriberId: 10
      });
    });

    it('should successfully encode and decode subscription request', function() {
      var buffer = utils.getBuffer();
      baServices.encodeSubscribeCOV(buffer, 11, {type: 3, instance: 2}, false, true, 5000);
      var result = baServices.decodeSubscribeCOV(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        isCancellation: false,
        isConfirmed: true,
        lifetime: 5000,
        objectId: {type: 3, instance: 2},
        subscriberId: 11
      });
    });
  });

  describe('AtomicWriteFileAcknowledge', function() {
    it('should successfully encode and decode streamed file', function() {
      var buffer = utils.getBuffer();
      baServices.encodeAtomicWriteFileAcknowledge(buffer, true, -10);
      var result = baServices.decodeAtomicWriteFileAcknowledge(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        isStream: true,
        position: -10
      });
    });

    it('should successfully encode and decode non-streamed file', function() {
      var buffer = utils.getBuffer();
      baServices.encodeAtomicWriteFileAcknowledge(buffer, false, 10);
      var result = baServices.decodeAtomicWriteFileAcknowledge(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        isStream: false,
        position: 10
      });
    });
  });

  describe('ReadProperty', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadProperty(buffer, 4, 630, 85, 0xFFFFFFFF);
      var result = baServices.decodeReadProperty(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {type: 4, instance: 630},
        property: {id: 85, index: 0xFFFFFFFF}
      });
    });

    it('should successfully encode and decode with array index', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadProperty(buffer, 4, 630, 85, 2);
      var result = baServices.decodeReadProperty(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {type: 4, instance: 630},
        property: {id: 85, index: 2}
      });
    });
  });

  describe('AtomicReadFile', function() {
    it('should successfully encode and decode as stream', function() {
      var buffer = utils.getBuffer();
      baServices.encodeAtomicReadFile(buffer, true, {type: 13, instance: 5000}, -50, 12);
      var result = baServices.decodeAtomicReadFile(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {type: 13, instance: 5000},
        count: 12,
        isStream: true,
        position: -50
      });
    });

    it('should successfully encode and decode as non-stream', function() {
      var buffer = utils.getBuffer();
      baServices.encodeAtomicReadFile(buffer, false, {type: 14, instance: 5001}, 60, 13);
      var result = baServices.decodeAtomicReadFile(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {type: 14, instance: 5001},
        count: 13,
        isStream: false,
        position: 60
      });
    });
  });

  describe('AtomicReadFileAcknowledge', function() {
    it('should successfully encode and decode as stream', function() {
      var buffer = utils.getBuffer();
      baServices.encodeAtomicReadFileAcknowledge(buffer, true, false, 0, 90, [[12, 12, 12]], [3]);
      var result = baServices.decodeAtomicReadFileAcknowledge(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        isStream: true,
        position: 0,
        endOfFile: false,
        buffer: Buffer.from([12, 12, 12])
      });
    });

    it('should successfully encode and decode as non-stream', function() {
      var buffer = utils.getBuffer();
      baServices.encodeAtomicReadFileAcknowledge(buffer, false, false, 0, 90, [12, 12, 12], 3);
      // TODO: AtomicReadFileAcknowledge as non-stream not yet implemented
      expect(function() {
        baServices.decodeAtomicReadFileAcknowledge(buffer.buffer, 0);
      }).to.throw('NotImplemented');
    });
  });

  // TODO: Correct test behaviour
  describe.skip('AtomicWriteFile', function() {
    it('should successfully encode and decode as stream', function() {
      var buffer = utils.getBuffer();
      // (buffer, isStream, objectId, position, blockCount, blocks, counts);
      baServices.encodeAtomicWriteFile(buffer, true, {type: 51, instance: 2}, 0, 100, [12, 12], 2);
      var result = baServices.decodeAtomicWriteFile(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {type: 51, instance: 2},
        count: 12,
        isStream: true,
        position: -50
      });
    });

    it('should successfully encode and decode as non-stream', function() {
      var buffer = utils.getBuffer();
      // (buffer, isStream, objectId, position, blockCount, blocks, counts);
      baServices.encodeAtomicWriteFile(buffer, false, {type: 51, instance: 2}, 0, 100, [12, 12], 2);
      var result = baServices.decodeAtomicWriteFile(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        objectId: {type: 51, instance: 2},
        count: 12,
        isStream: true,
        position: -50
      });
    });
  });

  describe('ReadRange', function() {
    it('should successfully encode and decode by position', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadRange(buffer, {type: 61, instance: 35}, 85, 0xFFFFFFFF, 1, 10, null, 0);
      var result = baServices.decodeReadRange(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        count: 0,
        objectId: {type: 61, instance: 35},
        position: 10,
        property: {
          index: 0xFFFFFFFF,
          id: 85
        },
        requestType: 1,
        time: undefined
      });
    });

    it('should successfully encode and decode by position with array index', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadRange(buffer, {type: 61, instance: 35}, 12, 2, 1, 10, null, 0);
      var result = baServices.decodeReadRange(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        count: 0,
        objectId: {type: 61, instance: 35},
        position: 10,
        property: {
          index: 2,
          id: 12
        },
        requestType: 1,
        time: undefined
      });
    });

    it('should successfully encode and decode by sequence', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadRange(buffer, {type: 61, instance: 35}, 85, 0xFFFFFFFF, 2, 11, null, 1111);
      var result = baServices.decodeReadRange(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        count: 1111,
        objectId: {type: 61, instance: 35},
        position: 11,
        property: {
          index: 0xFFFFFFFF,
          id: 85
        },
        requestType: 2,
        time: undefined
      });
    });

    it('should successfully encode and decode by time', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      date.setMilliseconds(990);
      baServices.encodeReadRange(buffer, {type: 61, instance: 35}, 85, 0xFFFFFFFF, 4, null, date, -1111);
      var result = baServices.decodeReadRange(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        count: -1111,
        objectId: {type: 61, instance: 35},
        position: undefined,
        property: {
          index: 0xFFFFFFFF,
          id: 85
        },
        requestType: 4,
        time: date
      });
    });
  });

// TODO: Rework different parameter types
  describe('EventNotifyData', function() {
    it('should successfully encode and decode a change of bitstring event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {type: 60, instance: 12},
        eventObjectId: {type: 61, instance: 1121},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 0,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: true,
        fromState: 5,
        toState: 6,
        bitstringChange: {
          bitstring: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24},
          statusFlags: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24}
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 60, instance: 12},
        eventObjectId: {type: 61, instance: 1121},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 0,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: true,
        fromState: 5,
        toState: 6
      });
    });

    it('should successfully encode and decode a change of state event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {},
        eventObjectId: {},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 1,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: false,
        fromState: 1,
        toState: 2,
        stateChange: {
          state: {type: 2, value: 2},
          statusFlags: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24}
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 0, instance: 0},
        eventObjectId: {type: 0, instance: 0},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 1,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: false,
        fromState: 1,
        toState: 2
      });
    });

    it('should successfully encode and decode a change of value event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {},
        eventObjectId: {},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 2,
        messageText: 'Test1234$',
        notifyType: 1,
        changeOfValueTag: 1,
        valueChange: {
          value: 90,
          statusFlags: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24}
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 0, instance: 0},
        eventObjectId: {type: 0, instance: 0},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 2,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: false,
        fromState: 0,
        toState: 0
      });
    });

    it('should successfully encode and decode a floating limit event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {},
        eventObjectId: {},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 4,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: true,
        fromState: 19,
        toState: 12,
        floatingLimit: {
          value: 121,
          statusFlags: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24},
          setpoint: 120,
          limit: 120
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 0, instance: 0},
        eventObjectId: {type: 0, instance: 0},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 4,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: true,
        fromState: 19,
        toState: 12
      });
    });

    it('should successfully encode and decode an out of range event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {},
        eventObjectId: {},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 5,
        messageText: 'Test1234$',
        notifyType: 1,
        outOfRange: {
          value: 155,
          statusFlags: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24},
          deadband: 50,
          limit: 150
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 0, instance: 0},
        eventObjectId: {type: 0, instance: 0},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 5,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: false,
        fromState: 0,
        toState: 0
      });
    });

    it('should successfully encode and decode a change of life-safety event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {},
        eventObjectId: {},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 8,
        messageText: 'Test1234$',
        notifyType: 1,
        lifesafetyChange: {
          state: 8,
          mode: 8,
          statusFlags: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24},
          operation: 2
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 0, instance: 0},
        eventObjectId: {type: 0, instance: 0},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 8,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: false,
        fromState: 0,
        toState: 0
      });
    });

    it('should successfully encode and decode a buffer ready event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {},
        eventObjectId: {},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 10,
        messageText: 'Test1234$',
        notifyType: 1,
        bufferReadyBufferProperty: {
          objectId: {type: 65, instance: 2},
          deviceId: {type: 8, instance: 443},
          property: {id: 85, index: 3},
          previousNotification: 121,
          currentNotification: 281
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 0, instance: 0},
        eventObjectId: {type: 0, instance: 0},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 10,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: false,
        fromState: 0,
        toState: 0
      });
    });

    it('should successfully encode and decode a unsigned range event', function() {
      var buffer = utils.getBuffer();
      var date = new Date();
      date.setMilliseconds(880);
      baServices.encodeEventNotifyData(buffer, {
        processId: 3,
        initObjectId: {},
        eventObjectId: {},
        timeStamp: {type: 2, value: date},
        notificationClass: 9,
        priority: 7,
        eventType: 11,
        messageText: 'Test1234$',
        notifyType: 1,
        unsignedRange: {
          value: 101,
          statusFlags: {value: [0xaa, 0xaa, 0xaa], bitsUsed: 24},
          limit: 100
        }
      });
      var result = baServices.decodeEventNotifyData(buffer.buffer, 0);
      delete result.len;
      expect(result).to.deep.equal({
        processId: 3,
        initObjectId: {type: 0, instance: 0},
        eventObjectId: {type: 0, instance: 0},
        timeStamp: date,
        notificationClass: 9,
        priority: 7,
        eventType: 11,
        messageText: 'Test1234$',
        notifyType: 1,
        ackRequired: false,
        fromState: 0,
        toState: 0
      });
    });
  });

  // TODO: Correct test behaviour
  describe.skip('ReadRangeAcknowledge', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeReadRangeAcknowledge(buffer, {type: 12, instance: 500}, 5048, 0xFFFFFFFF, {bitsUsed: 24, value: [1, 2, 3]}, 12, Buffer.from([1, 2, 3]), 2, 2);
      var result = baServices.decodeReadRangeAcknowledge(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        count: 0,
        objectId: {type: 61, instance: 35},
        position: 10,
        property: {
          index: 0xFFFFFFFF,
          id: 85
        },
        requestType: 1,
        time: undefined
      });
    });
  });

  describe('DeleteObject', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      baServices.encodeDeleteObject(buffer, {type: 1, instance: 10});
      var result = baServices.decodeDeleteObject(buffer.buffer, 0, buffer.offset);
      delete result.len;
      expect(result).to.deep.equal({
        type: 1,
        instance: 10
      });
    });
  });

  describe('CreateObject', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeCreateObject(buffer, {type: 1, instance: 10}, [
        {property: {id: 81, index: 0xFFFFFFFF}, values: [
          {type: 1, value: true},
          {type: 1, value: false},
          {type: 2, value: 1},
          {type: 2, value: 1000},
          {type: 2, value: 1000000},
          {type: 2, value: 1000000000},
          {type: 3, value: -1},
          {type: 3, value: -1000},
          {type: 3, value: -1000000},
          {type: 3, value: -1000000000},
          {type: 4, value: 0.1},
          {type: 5, value: 100.121212},
          {type: 6, value: [1, 2, 100, 200]},
          {type: 7, value: 'Test1234$'},
          {type: 8, value: [], bitsUsed: 0 },
          {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
          {type: 9, value: 4},
          {type: 10, value: date},
          {type: 11, value: time}
        ], priority: 0},
        {property: {id: 82, index: 0}, values: [
          {type: 12, value: {type: 3, instance: 0}}
        ], priority: 0}
      ]);
      var result = baServices.decodeCreateObject(buffer.buffer, 0, buffer.offset);
      delete result.len;
      result.values[0].values[10].value = Math.floor(result.values[0].values[10].value * 1000) / 1000;
      expect(result).to.deep.equal({
        objectId: {
          type: 1,
          instance: 10
        },
        values: [
          {
            property: {
              index: 0xFFFFFFFF,
              id: 81
            },
            values: [
              {type: 1, value: true},
              {type: 1, value: false},
              {type: 2, value: 1},
              {type: 2, value: 1000},
              {type: 2, value: 1000000},
              {type: 2, value: 1000000000},
              {type: 3, value: -1},
              {type: 3, value: -1000},
              {type: 3, value: -1000000},
              {type: 3, value: -1000000000},
              {type: 4, value: 0.1},
              {type: 5, value: 100.121212},
              {type: 6, value: [1, 2, 100, 200]},
              {type: 7, value: 'Test1234$', encoding: 0},
              {type: 8, value: [], bitsUsed: 0},
              {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
              {type: 9, value: 4},
              {type: 10, value: date},
              {type: 11, value: time}
            ]
          },
          {
            property: {
              index: 0xFFFFFFFF,
              id: 82
            },
            values: [
              {type: 12, value: {type: 3, instance: 0}}
            ]
          }
        ]
      });
    });
  });

  describe('COVNotify', function() {
    it('should successfully encode and decode', function() {
      var buffer = utils.getBuffer();
      var date = new Date(1, 1, 1);
      var time = new Date(1, 1, 1);
      time.setMilliseconds(990);
      baServices.encodeCOVNotify(buffer, 7, 443, {type: 2, instance: 12}, 120, [
        {property: {id: 81, index: 0xFFFFFFFF}, value: [
          {type: 1, value: true},
          {type: 1, value: false},
          {type: 2, value: 1},
          {type: 2, value: 1000},
          {type: 2, value: 1000000},
          {type: 2, value: 1000000000},
          {type: 3, value: -1},
          {type: 3, value: -1000},
          {type: 3, value: -1000000},
          {type: 3, value: -1000000000},
          {type: 4, value: 0.1},
          {type: 5, value: 100.121212},
          {type: 6, value: [1, 2, 100, 200]},
          {type: 7, value: 'Test1234$'},
          {type: 8, value: [], bitsUsed: 0},
          {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
          {type: 9, value: 4},
          {type: 10, value: date},
          {type: 11, value: time}
        ], priority: 0},
        {property: {id: 82, index: 0}, value: [
          {type: 12, value: {type: 3, instance: 0}}
        ], priority: 8}
      ]);
      var result = baServices.decodeCOVNotify(buffer.buffer, 0, buffer.offset);
      delete result.len;
      result.values[0].values[10].value = Math.floor(result.values[0].values[10].value * 1000) / 1000;
      expect(result).to.deep.equal({
        deviceId: {
          type: 8,
          instance: 443
        },
        objectId: {
          type: 2,
          instance: 12
        },
        subscriberId: 7,
        timeRemaining: 120,
        values: [
          {
            priority: 0,
            property: {
              index: 0xFFFFFFFF,
              id: 81
            },
            values: [
              {type: 1, value: true},
              {type: 1, value: false},
              {type: 2, value: 1},
              {type: 2, value: 1000},
              {type: 2, value: 1000000},
              {type: 2, value: 1000000000},
              {type: 3, value: -1},
              {type: 3, value: -1000},
              {type: 3, value: -1000000},
              {type: 3, value: -1000000000},
              {type: 4, value: 0.1},
              {type: 5, value: 100.121212},
              {type: 6, value: [1, 2, 100, 200]},
              {type: 7, value: 'Test1234$', encoding: 0},
              {type: 8, value: [], bitsUsed: 0},
              {type: 8, value: [0xAA, 0xAA, 0xAA], bitsUsed: 24},
              {type: 9, value: 4},
              {type: 10, value: date},
              {type: 11, value: time}
            ]
          },
          {
            priority: 0,
            property: {
              index: 0xFFFFFFFF,
              id: 82
            },
            values: [
              {type: 12, value: {type: 3, instance: 0}}
            ]
          }
        ]
      });
    });
  });
});
