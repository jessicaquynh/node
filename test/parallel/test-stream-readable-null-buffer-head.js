'use strict';
const common = require('../common');
const Readable = require('_stream_readable');
const assert = require('assert');

const emdash = new Buffer([0xE2, 0x80, 0x94]);
const euro = new Buffer([0xE2, 0x82, 0xAC]);
const source = Buffer.concat([emdash, euro, Buffer.from('asdfasl')]);
const errorMsg = 'howMuchToRead attempts to retrieve data from an empty buffer.head';

exactBuffer();
oddNumberBuffer();

var exactBuf = '';
function exactBuffer() {
  var readable = Readable({ encoding: 'utf8' });
  readable.push(source);
  readable.push(null);

  readable.on('data', data => {
    exactBuf += data;
  });
}

var oddBuf = '';
function oddNumberBuffer() {
  var readable = Readable({ encoding: 'utf8' });

  readable.push(source.slice(0, 2));
  readable.push(source.slice(2, 4));
  readable.push(source.slice(4, 14));
  readable.push(null);

  readable.on('data', data => {
    oddBuf += data;
  });
}

process.on('uncaughtException', (e) => {
  console.log(e);
  throw new Error(errorMsg);
});

process.on('exit', function() {
  assert.strictEqual(exactBuf, '—€asdfasl');
  assert.strictEqual(oddBuf, '—€asdfasl');
});
