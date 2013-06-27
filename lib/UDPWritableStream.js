var Writable = require('stream').Writable,
    util = require("util"),
    dgram = require("dgram"),
    Throttle = require('throttle'),
    CountInjector = require('./CountInjectorStream');

//UDP Readable Stream
var UDPWritableStream = function(options) {
    var self = this;
    this.port = options.port;
    this.addr = options.addr;
    this.rate = options.rate;

    if (!(this instanceof UDPWritableStream))
        return new UDPWritableStream(options);

    Writable.call(this, options);

    this.counter = new CountInjector();
    this.outgoing = dgram.createSocket("udp4");
    this.throttle = new Throttle(this.rate);
    this.throttle.pipe(this.counter);
    this.counter.on('data', function(chunk, encoding, callback) {
        self.outgoing.send(chunk, 0, chunk.length, self.port, self.addr, function(err, bytes) {
	  if (err) console.log(err);
 	  if (callback) callback(err, bytes);
        });
    });

    this.counter.on('end', function() {
	self.outgoing.close();
        self.end();
    });
}

util.inherits(UDPWritableStream, Writable);

UDPWritableStream.prototype._write = function(chunk, encoding, callback) {
    this.throttle.write(chunk, encoding, callback);
};

module.exports = UDPWritableStream;
