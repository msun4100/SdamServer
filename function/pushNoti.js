// pushNoti.js

// 글과 관련된 푸시
var express = require('express');
var router = express.Router();

var gcm = require('node-gcm');

// GCM에 등록된 app key 값
var sender = new gcm.Sender('AIzaSyC-8UXLmnMSmYuekDeBsxt8Wq1kGeRqJGs');

// num 은 글번호값
// caseName에 따라 case 값 설정
// caseName 은 string으로 해당 작업이 무엇인지
var pushNoti = function (num, replyNum, caseName, pushId) {
	// db에서 가져온 pushId 값으로 push를 보낸다

	// 푸시가 무엇인지 확인
	var pushCase;
	if(caseName === 'good') {
		pushCase = 1;
	} else if(caseName === 'goodreply') {
		pushCase = 2;
	} else if(caseName === 'reply') {
		pushCase = 3;
	} else if(caseName === 'tag') {
		pushCase = 4;
	} else if(caseName === 'notice') {
		pushCase = 5;
	}

	// push방식이 변경되어
	// 동일한 글번호/댓글번호에 동일한 작업이 올 시 묶어준다면
	// num 에는 글번호를 repNum 에는 댓글번호를 주면 된다.
	var message = new gcm.Message({
		collapseKey: 'SDAMpush',
		delayWhileIdle: true,
		timeToLive: 3,
		"num" : null,
		"repNum" : null,
		"pushCase" : null
	});

	switch(caseName) {
		case 'good' :
		// case 1
		message.addData('num', num);
		message.addData('pushCase', pushCase);
		break;

		case 'goodreply' :
		// case 2
		message.addData('num', num);
		message.addData('pushCase', pushCase);
		break;

		case 'reply' :
		// case 3
		message.addData('num', num);
		message.addData('pushCase', pushCase);
		break;

		case 'tag' :
		// case 4
		message.addData('num', num);
		message.addData('pushCase', pushCase);
		break;

		case 'notice' :
		// case 5
		message.addData('num', num);
		message.addData('pushCase', pushCase);
		break;
	}

	sender.send(message, pushId, 10, function (err, result) {
		if(err) {
			console.log(err);
		}
		// console.log('message : ', message);
		// console.log('result : ', result);
	});
}

module.exports = pushNoti;