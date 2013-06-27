var Transform = require('stream').Transform,
    util = require("util"),
    dgram = require("dgram");

var COUNT_BYTE_LENGTH = 4;

//Count Extractor Stream
var CountExtractorStream = function(options) {
    var self = this;
    
    if (options) {
         this.onLength = options.onLength;
    }

    if (!(this instanceof CountExtractorStream))
        return new CountExtractorStream(options);

    Transform.call(this, options);
}

util.inherits(CountExtractorStream, Transform);

CountExtractorStream.prototype._transform = function(chunk, encoding, callback) {
    
    var length = chunk.readUInt32BE(0)
    //var length = chunk.slice(0, COUNT_BYTE_LENGTH).readUInt8(0)
    this.push(chunk.slice(COUNT_BYTE_LENGTH), encoding);
    callback();
    if (this.onLength) {
        this.onLength(length);
    }
};

module.exports = CountExtractorStream;
