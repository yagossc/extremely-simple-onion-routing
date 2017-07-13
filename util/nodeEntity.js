exports.constructor = function(ip, pubKey)
{
	var objNode = new Object();
	objNode.ip = ip;
	objNode.pubKey = pubKey;

	return objNode;
}
