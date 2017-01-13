// delreply.js

var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/delete/delreply');

// 댓글삭제
/* id를 비교하여 글쓴이와 같은 경우에만 삭제 버튼이 나온다. */
router.post('/', function (req, res) {
	var num = req.body.num;	// 지우려는 글의 글번호
	var repNum = req.body.repNum;	// 지우려는 댓글의 글번호
	var id = req.session.userId;	// session 에 저장된 값

	var datas = [num, repNum, id];

	if(num === undefined) {
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else if(id === undefined) {
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
	} else {
		// 값이 넘어오면 작업
		db.delreply(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkReply_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteGood_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteReport_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteTag_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteReply_error') {
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
				// 성공시
				if(result === true) {
					// json 응답
					res.json({
						"success" : 1,
						"work" : "delete_reply",
						"result" : "ok"
					});
				}
			}
		});
	}
});

module.exports = router;