// report.js
var express = require('express');
var router = express.Router();
// DB 객체
var db = require('../../../db_models/mobile/report/report');

// 글신고
/* 글 신고 이므로 DB신고 카운트 1증가 */
router.post('/', function (req, res) {
	var num = req.body.num;
	var writer = req.body.writer;
	var category = req.body.category;
	var id = req.session.userId;	// session에 저장된 정보

	var datas = [num, writer, category];
	console.log('datas : ', datas);

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
	} else if(category === undefined) {
		res.json({
			"success" : 0,
			"work" : "category_undefined",
			"result" : null
		});
	} else {
		db.report(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'insertBan_error') {
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
			} else if(result === 'userBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				res.json({
					"success" : 1,
					"work" : "report",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;