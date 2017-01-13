// aban.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/ban/articleBan');

// 글 차단
router.post('/', function (req, res) {
	var num = req.body.num;
	var writer = req.body.writer;
	var id = req.session.userId;	// session 에 저장된 값

	var datas = [id, num, writer];

	if(num === undefined) {
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else if(writer === undefined) {
		res.json({
			"success" : 0,
			"work" : "writer_undefined",
			"result" : null
		});
	}else {
		// DB 연결 성공
		db.articleBan(datas, function (result) {
			if(result === 'insertBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'countBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === 'userBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result == 1) {
				// 밴 당한 경우
				res.json({
					"success" : 1,
					"work" : "ban_article",
					"result" : "ok"
				});
			} else if(result == 0)  {
				// 밴당하지 않은 경우
				res.json({
					"success" : 1,
					"work" : "ban_article",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;