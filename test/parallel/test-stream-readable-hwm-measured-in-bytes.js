'use strict';
require('../common');
const stream = require('stream');
const assert = require('assert');
const StringDecoder = require('string_decoder').StringDecoder;

const decoder = new StringDecoder('utf8');
const source = new Buffer([0xE2, 0x82, 0xAC, 'randomStr', 9912124]);

const readable = new stream.Readable({
  objectMode: false,
  encoding: 'utf8',
  highWaterMark: 4
});

var stringChunk = decoder.write(source);
var byteLength = Buffer.byteLength(stringChunk, 'utf8');



var pushResult = readable.push(source);
readable.push(null);

process.on('exit', function(){
  assert.equal(false, byteLength === stringChunk.length);
  assert.equal(true, stringChunk.length < readable._readableState.highWaterMark);
  assert.equal(false, byteLength < readable._readableState.highWaterMark);
  assert.equal(false, pushResult);
});