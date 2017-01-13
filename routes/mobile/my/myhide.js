// myhide.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/my/myhide');

// 내가 쓴 글 비공개로 하기
router.post('/', function (req, res) {
	var id = req.session.userId;	//session에 저장된 값
	var num = req.body.num;	// 비공개로 하려는 글번호
	var locked = req.body.locked;	// 비공개로 할지 비공개 해제할지

	// 전달할 정보
	var datas = [ locked, num, id ];

	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else if(num === undefined) {
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else {
		db.myhide(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'myhide_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === true) {
				// 작업 성공
				res.json({
					"success" : 1,
					"work" : "myhide",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;