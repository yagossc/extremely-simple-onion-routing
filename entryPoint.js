var net = require('net');
var nodeObj = require('./nodeEntity.js');

var getCircuit = new net.Socket();
var entryPoint = new net.Socket();
var buffer = [];
var circuit = [];
var nodeIp;
var nodePKey;

getCircuit.connect(3478, '10.10.100.66');

getCircuit.on('connect', function()
{
	console.log('[CONNECTED]');
	//start HandShake
	getCircuit.write('&');
});

getCircuit.on('data', function(data)
{
	var msg = data.toString().trim();
//	console.log("[LOGGIN]: " + msg);
	if(msg === 'OK')
		getCircuit.write('#');

	if(msg[0] === '@')
	{
		nodeIp = msg.slice(1);		
	}
	if(msg[0] === '#')
	{
		nodePKey = msg.slice(1);
		circuit.push(nodeObj.constructor(nodeIp, nodePKey));
	}
});

getCircuit.on('close', function()
{
	console.log("[LOGGING]: Circuit stabilished sucessfully");
	circuit.forEach(function(node)
	{
		console.log(node.ip + '\n' + node.pubKey + '\n');
	});
	entryPoint.connect(1234, circuit[0].ip);
});

entryPoint.on('connect', function()
{
	console.log('[CONNECTED]');
	entryPoint.write('$'+circuit[0].pubKey);
});

entryPoint.on('close', function()
{
	console.log("[SYSTEM]: Connection closed.");
	entryPoint.end();
});
