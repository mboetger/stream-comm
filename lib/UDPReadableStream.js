var Readable = require('stream').Readable,
    util = require("util"),
    dgram = require("dgram");

//UDP Readable Stream
var UDPReadableStream = function(options) {
    var self = this;
    this.port = options.port;

    if (!(this instanceof UDPReadableStream))
        return new UDPReadableStream(options);

    Readable.call(this, options);

    this.incoming = dgram.createSocket("udp4", function(msg, rinfo) {
            console.log('read');
            self.push(msg);
        });

    this.incoming.bind(this.port, '0.0.0.0');

}

util.inherits(UDPReadableStream, Readable);

UDPReadableStream.prototype._read = function(n) {
    //don't do anything here?
};

module.exports = UDPReadableStream;
