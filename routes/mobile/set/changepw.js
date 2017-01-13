// changepw.js

var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/set/changepw');
// 비밀번호 암호화 객체
var bcrypt = require('bcrypt');

router.post('/', function (req, res) {
	var userId = req.session.userId;	// 사용자 id
	var pw = req.body.newPw;	// 새로운 비밀번호

	// 암호화
	var salt = bcrypt.genSaltSync(10);
	var newPw = bcrypt.hashSync(pw, salt);

	if(userId === undefined) {
		res.json({
			"success" : 0,
			"work" : "email_undefined",
			"result" : null
		});
	} else if(pw === undefined) {
		res.json({
			"success" : 0,
			"work" : "password_undefined",
			"result" : null
		});
	} else if(newPw === undefined) {
		res.json({
			"success" : 0,
			"work" : "hash error",
			"result" : null
		});
	} else {
		// 값을 제대로 받은 경우
		var datas = [newPw, userId];

		db.changepw(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result ==='UPDATE_query_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'No_value') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === true) {
				// 비밀번호 변경 완료
				res.json({
					"success" : 1,
					"work" : "changepw",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;