var net = require('net');
var NodeRSA = require('node-rsa');

var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});

//key.generateKeyPair();i
var publicKey = key.exportKey('pkcs8-public-pem');
var privateKey = key.exportKey('pkcs8-private-pem');

var text = "WORKING!";

var client = new net.Socket();
var bridge = new net.Socket();

var newKey = new NodeRSA();
var keyData;
var newKey2 = new NodeRSA();
newKey2.importKey(privateKey, 'pkcs8-private-pem');

var dec;

client.connect(3478, '192.168.25.173');

client.on('connect', function()
{
	console.log('[CONNECTED]');
	//start HandShake
	client.write('&');
});

client.on('data', function(data)
{
	var msg = data.toString().trim();
	console.log("[LOGGIN]: " + msg);
	if(msg === 'OK')
		client.write('$'+publicKey);

	//Testing if sent key comes back correctly
/*	if(msg[0] === '$')
	{
		keyData = msg.slice(1);
		console.log(keyData);
		newKey.importKey(keyData, 'pkcs8-public-pem');
		console.log(newKey);

		var encrypted = newKey.encrypt(text, 'base64');
		var decrypted = newKey2.decrypt(encrypted, 'utf8');

		console.log('\n\n[DECRYPTED]: ' + decrypted);
	}*/
});

client.on('close', function()
{
	console.log("[LOGGING]: Connection ended.");
});

net.createServer(function(socket)
{
	socket.on('data', function(data)
	{
		var msg = data.toString().trim();
		console.log("[LOGGING SERVER]: " + msg);
		//Testing if sent key comes back correctly
/*		if(msg[0] === '$')
		{
			keyData = msg.slice(1);
//			console.log("[KEYDATA]: "+keyData);
			newKey.importKey(keyData, 'pkcs8-public-pem');
//			console.log(newKey);
	
			var encrypted = newKey.encrypt(text, 'base64');
			var decrypted = newKey2.decrypt(encrypted, 'utf8');
	
			console.log('\n\n[DECRYPTED]: ' + decrypted);
		}
*/
		//Received Onion
		if(msg[0] === '%')
		{
			var encrypted = msg.slice(1);
			var decrypted = newKey2.decrypt(encrypted, 'utf8');
			dec = JSON.parse(decrypted);
			console.log(dec.ip + ' enc: ' + dec.encryption);
			bridge.connect(1234, dec.ip);
		}
	});

}).listen(1234);
console.log("Listening at port 1234");

bridge.on('connect', function()
{
	console.log('\n\nCONNECTED TO OTHER NODE');
//	bridge.write('HELLO!');
	bridge.write('%'+dec.encryption);
});
