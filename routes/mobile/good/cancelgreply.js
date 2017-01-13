// cancelgreply.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/good/cancelgreply');

// 댓글 공감 취소하기
router.post('/', function (req, res) {
	var num = req.body.num;
	var id = req.session.userId;	// session에 저장된 값
	var repNum = req.body.repNum;

	var datas = [id, num, repNum];

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
		// 성공적으로 값을 받은 경우 작업
		db.cancelgreply(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'cancelgreply_SELECT_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'cancelgreply_DELETE_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				// query 성공
				if(result === true) {
					// json 응답
					res.json({
						"success" : 1,
						"work" : "cancelgreply",
						"result" : "ok"
					});
				}
			}
		});
	}
});

module.exports = router;