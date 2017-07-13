exports.constructor = function(ip, encryption)
{
	var onionPeel = new Object();
	onionPeel.ip = ip;
	onionPeel.encryption = encryption;

	return onionPeel;
}
