var dgram = require("dgram"),
    UDPReadableStream = require('./lib/UDPReadableStream'),
    CountExtractorStream = require('./lib/CountExtractorStream'),
    Speaker = require('speaker'),
    lame = require('lame'),
    fs = require('fs');

var stream = new UDPReadableStream({"port":41234});

var onLength = function(length) {
    console.log(length);
}

var extractor = new CountExtractorStream({onLength:onLength});

//stream.pipe(process.stdout); 
//fs.createWriteStream(process.argv[2]);

stream.pipe(extractor).pipe(new lame.Decoder()).on('format', function (format) {
    console.log('format', format);
    this.pipe(new Speaker(format));
});

stream.on('end', function() { console.log('end'); });
