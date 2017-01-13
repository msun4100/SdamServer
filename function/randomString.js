var randomString = function randomString(length) {
	var data = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
	for (var i = length; i > 0; --i) {
		result += data[Math.round(Math.random() * (data.length - 1))];
	}
	return result;
}


module.exports = randomString;