// good.js
var gcm = require('node-gcm');
var express = require('express');
var router = express.Router();
// push 함수
var pushNoti = require('../../../function/pushNoti');

// DB 객체
var db = require('../../../db_models/mobile/good/good');

// 글 공감하기
router.post('/', function (req, res) {

	var num = req.body.num;
	var writer = req.body.writer;
	var userId = req.session.userId;	// session에 저장된 값

	if(num === undefined) {
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else if(userId === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else if(writer === undefined) {
		res.json({
			"success" : 0,
			"work" : "writer_undefined",
			"result" : null
		});
	} else {
		// 값 제대로 받을 시 DB 작업

		// 전달할 datas 생성
		var datas = [num, userId, writer];

		db.good(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'insertGood_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'getPushId_error') {
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
			} else {
				// DB 작업 성공시
				var pushId = [result[0].push_id];

				if(writer !== userId) {
					pushNoti(num, null, 'good', pushId);
				}

				res.json({
					"success" : 1,
					"work" : "good",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;