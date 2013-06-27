var Transform = require('stream').Transform,
    util = require("util"),
    dgram = require("dgram"),
    Throttle = require('throttle');

var COUNT_BYTE_LENGTH = 4; 

//Countable Writable Stream
var CountInjectorStream = function(options) {
    var self = this;

    if (!(this instanceof CountInjectorStream))
        return new CountInjectorStream(options);

    Transform.call(this, options);

    this.count = 0; 
}

util.inherits(CountInjectorStream, Transform);

CountInjectorStream.prototype._transform = function(chunk, encoding, callback) {
    var buf = new Buffer(chunk.length + COUNT_BYTE_LENGTH);
    buf.writeUInt32BE(this.count++,0);
    //buf.writeUInt8(this.count++,0);
    if (chunk.length > 0) {
        chunk.copy(buf, COUNT_BYTE_LENGTH);
    }
    console.log(buf.readUInt32BE(0));
    this.push(buf, encoding);
    callback();
};

module.exports = CountInjectorStream;
