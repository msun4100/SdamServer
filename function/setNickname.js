function setNickname (array) {
	var nick;
	var nickArray = array;

	do{
		// 1~99
		var nickIndex = Math.floor((Math.random()*99)+1);
		// Math.floor(Math.random()*(max-min+1+min))
		nick = String(nickIndex);
		console.log(nick);
	} while(nickArray.indexOf(nick) !== -1)
	// -1이 되는 순간 while 문 밖으로 이동
	// 배열 내부 원소와 비교하는 값의 형도 같도록 String으로 통일

	return nick;
}

module.exports = setNickname;