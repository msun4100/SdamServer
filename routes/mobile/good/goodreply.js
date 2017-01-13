// goodreply.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/good/goodreply');
// push 함수
var pushNoti = require('../../../function/pushNoti');

// 댓글 공감하기
router.post('/', function (req, res) {
	var userId = req.session.userId;	// session에 저장된 값
	var repNum = req.body.repNum;
	var num = req.body.num;
	var repAuthor = req.body.repAuthor;

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
	} else if(repNum === undefined) {
		res.json({
			"success" : 0,
			"work" : "repNum_undefined",
			"result" : null
		});
	} else if(repAuthor === undefined) {
		res.json({
			"success" : 0,
			"work" : "repAuthor_undefined",
			"result" : null
		});
	} else {
		// 값 제대로 받은 경우

		// 전달할 값
		var datas = [userId, num, repNum, repAuthor];

		db.goodreply(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'insertGoodReply_error') {
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
				// query 성공
				/// DB 작업 성공시

				var pushId = [result[0].push_id];

				if(repAuthor !== userId) {
					pushNoti(num, null, 'goodreply', pushId);
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