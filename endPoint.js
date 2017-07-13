var net = require('net');

net.createServer(function(socket)
{
	console.log('RECEIVED CONNECTION');
	socket.on('data', function(data)
	{
		var msg = data.toString().trim()
		if(msg[0] === '%')
			msg = msg.slice(1)
		console.log(msg);
	});
}).listen(1234);
console.log("Listening on port 1234");
