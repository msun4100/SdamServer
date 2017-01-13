// checkInfo.js

var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/set/checkInfo');

router.post('/', function (req, res) {
	var userId = req.session.userId;	// 사용자 id
	var curPw = req.body.curPw;	// 현재 비밀번호

	if(userId === undefined) {
		res.json({
			"success" : 0,
			"work" : "email_undefined",
			"result" : null
		});
	} else if(curPw === undefined) {
		res.json({
			"success" : 0,
			"work" : "password_undefined",
			"result" : null
		});
	} else {
		// 값을 제대로 받은 경우
		var datas = [userId, curPw];

		db.checkInfo(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result ==='SELECT_COUNT_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'pw_unmatch') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === true) {
				// 회원정보 확인완료, 변경할 비밀번호 받는 페이지로 이동
				res.json({
					"success" : 0,
					"work" : "checkInfo",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;