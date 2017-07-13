var net = require('net');
var nodeObj = require('./util/nodeEntity.js');
var NodeRSA = require('node-rsa');
var onion = require('./util/onionPeel.js');
var getCircuit = new net.Socket();
var entryPoint = new net.Socket();
var circuit = [];
var nodeIp;
var nodePKey;

var key = new NodeRSA();

var message = "Onion Routing!";

var endPoint = '192.168.25.12';

getCircuit.connect(3478, '192.168.25.173');

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
	var finalNode = 
	entryPoint.connect(1234, circuit[0].ip);
});

entryPoint.on('connect', function()
{
	console.log('[CONNECTED]');
	entryPoint.write('$'+circuit[0].pubKey);
	var onion = createOnion();
});

entryPoint.on('close', function()
{
	console.log("[SYSTEM]: Connection closed.");
	entryPoint.end();
});

function createOnion()
{
	key.importKey(circuit[circuit.length - 1].pubKey, 'pkcs8-public-pem');
	var encryption = key.encrypt(onion.constructor(endPoint, message), 'base64'); 
	for(var i = circuit.length - 2; i > -1; i--)
	{
		key.importKey(circuit[i].pubKey, 'pkcs8-public-pem');
		encryption = key.encrypt(onion.constructor(circuit[i+1].ip, encryption), 'base64');
	}
	//Send onion
	entryPoint.write('%'+encryption);
	//JSON.parse(decrypted) so you can access the object
}
