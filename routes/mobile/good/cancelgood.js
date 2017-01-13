// cancelgood.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/good/cancelgood');

// 글 공감 취소하기
router.post('/', function (req, res) {

	var num = req.body.num;
	var id = req.session.userId;	// session에 저장된 값

	var datas = [num, id];

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
	} else {
		// 성공시
		db.cancelgood(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'cancelgood_SELECT_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'cancelgood_DELETE_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === 'NO_value') {
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
						"work" : "cancelgood",
						"result" : "ok"
					});
				}
			}
		});
	}
});

module.exports = router;