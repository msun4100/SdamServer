// withdraw.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/withdraw/withdraw');

// 회원탈퇴
router.post('/', function (req, res) {
	var id = req.session.userId;	// session 에 저장된 값
	var pw = req.body.pw;	// 비밀번호

	var datas = [id, pw];

	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else if (pw === undefined) {
		res.json({
			"success" : 0,
			"work" : "pw_undefined",
			"result" : null
		});
	} else {
		db.withdraw(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'SELECT_COUNT_error') {
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
			} else if(result === 'DELETE_query_error') {
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
			} else {
				// 작업 성공
				res.json({
					"success" : 1,
					"work" : "withdraw",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;