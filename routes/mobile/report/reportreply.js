// reportreply.js
var express = require('express');
var router = express.Router();

var db = require('../../../db_models/mobile/report/reportreply');

// 댓글 신고
router.post('/', function (req, res) {
	var num = req.body.num;
	var category = req.body.category;
	var repNum = req.body.repNum;
	var repWriter = req.body.repWriter;
	var id = req.session.userId;	// session에 저장된 정보

	var datas = [num, id, repNum, category, repWriter];

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
	} else if(repWriter === undefined) {
		res.json({
			"success" : 0,
			"work" : "repWriter_undefined",
			"result" : null
		});
	} else if(category === undefined) {
		res.json({
			"success" : 0,
			"work" : "category_undefined",
			"result" : null
		});
	} else {
		// 값 성공적으로 받은 경우
		db.reportreply(datas, function (result) {
			if(result === 'reportreply_insertBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === 'reportreply_countBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === 'reportreply_userBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				// query 성공
				res.json({
					"success" : 1,
					"work" : "reportreply",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;