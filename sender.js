var dgram = require('dgram');
    UDPWritableStream = require('./lib/UDPWritableStream'),
    fs = require('fs');

var stream = new UDPWritableStream({
	"port":41234, 
	"addr": "127.0.0.1",
        "rate": 50 * 1024});

//process.stdin.pipe(stream);
fs.createReadStream(process.argv[2]).pipe(stream);

/*var client = dgram.createSocket("udp4");

client.send(message, 0, message.length, 41234, "localhost", function(err, bytes) {
    client.close();
});
    */
