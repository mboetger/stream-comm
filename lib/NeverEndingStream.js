var Readable = require('stream').Readable,
    util = require("util");

//Pandora Readable Stream
var NeverEndingStream = function(options) {
    if (!(this instanceof NeverEndingStream))
        return new NeverEndingStream(options);

    Readable.call(this, options);

    this.currentStream = null;
    this.streamQueue = [];
}

util.inherits(NeverEndingStream, Readable);

NeverEndingStream.prototype._read = function(n) {
    console.log('read');
    return (this.getCurrentStream() != null);
};

NeverEndingStream.prototype.queue = function(stream) {
    this.streamQueue.push(stream);
};

NeverEndingStream.prototype.getNextStream = function() {
    var that = this;
    if (this.streamQueue == null || this.streamQueue.length == 0) { return null; }

    var currentStream = this.streamQueue.shift();
    currentStream.on('data', function(chunk) {
        that.push(chunk);
    });
    currentStream.on('end', function() {
        if (currentStream && currentStream.close) { currentStream.close() };
        that.currentStream = that.getNextStream();
        if (that.currentStream == null) {
            that.emit('end');
        }
    });
    return currentStream;
};

NeverEndingStream.prototype.getCurrentStream = function() {
    var that = this;
    if (this.currentStream == null) {
        this.currentStream = this.getNextStream();
    }
    return this.currentStream;
};

module.exports = NeverEndingStream;