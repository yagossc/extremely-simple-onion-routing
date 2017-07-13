var net = require('net');
var nodeObj = require('./util/nodeEntity.js');
var sleep = require('sleep');

var circuitNodes = [];

//Create server
net.createServer(function  (socket) {
	var remoteIP = socket.remoteAddress.split(':');
	console.log("REMOTE: " + remoteIP[3]);
	console.log(socket.remoteAddress);
	socket.on('data', function(data)
	{
		var msg = data.toString().trim();
		console.log("[LOGGING]: " + msg);
		//if start HandShake
		if(msg[0] === '&')
			socket.write('OK');//send Ok
		//Receiving public key
		if(msg[0] === '$')
		{
			//Inform key received
			socket.write('Key received on server');

			//Format msg to get key
			var pubKey = msg.slice(1);


			//Push object to nodes list
			circuitNodes.push(nodeObj.constructor(remoteIP[3], pubKey));
			
			//Testing
			//console.log("[PUBLIC KEY] :\n" + pubKey + "\n\n");
			socket.write('$'+circuitNodes[circuitNodes.length - 1].pubKey);
			//End Connection
			socket.end();
		}

		//Responding to solicited circuit

		//For learning purposes, this will simply return the entire list
		if(msg[0] === '#')
		{
			console.log("[LOGGIN]: Sending circuit");
			circuitNodes.forEach(function(node)
			{
				console.log('SENDING: '+ node.pubKey);
				socket.write("@"+node.ip);
				sleep.msleep(200);
				socket.write("#"+node.pubKey);
				sleep.msleep(200);
			});

			socket.end();
		}

	});

	socket.on('close', function()
	{
		socket.end();
	});
}).listen(3478);
console.log("Listening at port 3478");

