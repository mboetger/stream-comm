var Extractor = require('./lib/CountExtractorStream'),
    Injector = require('./lib/CountInjectorStream'),
    UDPReadableStream = require('./lib/UDPReadableStream'),
    UDPWritableStream = require('./lib/UDPWritableStream');

var count = function(length) { console.log('Count:\t' + length); }
var extractor = new Extractor({onLength:count});
var injector = new Injector();

var reader = new UDPReadableStream({"port":41234});
var writer = new UDPWritableStream({
        "port":41234,
        "addr": "127.0.0.1",
        "rate": 50 * 1024});

process.stdin.pipe(injector).pipe(writer);

reader.pipe(extractor).pipe(process.stdout);
