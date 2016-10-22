'use strict';
const common = require('../common');
const Readable = require('_stream_readable');
const assert = require('assert');

var buf = '';
const emdash = new Buffer([0xE2, 0x80, 0x94]);
const euro = new Buffer([0xE2, 0x82, 0xAC]);
const source = Buffer.concat([emdash, euro]);

const readable = Readable({ encoding: 'utf8' });

readable.push(source.slice(0, 4));
readable.push(source.slice(4, 6));
readable.push(null);

readable.on('data', data => {
  console.log(data);
  process.nextTick = () => {
    if (readable._readableState.length !== 0 &&
        readable._readableState.flowing &&
        readable._readableState.buffer.head == null) {
      throw new Error(`howMuchToRead attempts to retrieve data from an empty buffer.head`);
    }
  };

  buf += data;
});

process.on('exit', function() {
  assert.strictEqual(buf, '—€');
});
