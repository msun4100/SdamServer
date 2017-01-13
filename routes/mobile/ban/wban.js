// wban.js
var express = require('express');
var router = express.Router();


// DB 연결
var db = require('../../../db_models/mobile/ban/writerBan');

// 글쓴이 차단
router.post('/', function (req, res) {
	var num = req.body.num;
	var id = req.session.userId;	// session 에 저장된 정보
	var writer = req.body.writer;

	var datas = [id, num, writer];

	console.log('datas : ', datas);

	if(num === undefined) {
		res.json({
			"success" : 0,
			"work" : "ban_writer",
			"result" : null
		});
	} else if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "ban_writer",
			"result" : null
		});
	} else {
		// DB 연결 성공
		db.writerBan(datas, function (result) {
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
			// } else if(result == 0) {
			// 	// 밴당하지 않은 경우
			// 	res.json({
			// 		"success" : 1,
			// 		"work" : "ban_writer",
			// 		"result" : "ok"
			// 	});
			// } else if(result == 1) {
			// 	// 밴 당한 경우
			// 	res.json({
			// 		"success" : 1,
			// 		"work" : "ban_writer",
			// 		"result" : "ok"
			// 	});
			} else {
				// query 성공
				res.json({
					"success" : 1,
					"work" : "ban_writer",
					"result" : "ok"
				});
			}
		});


		// res.json({
		// 	"success" : 1,
		// 	"work" : "ban_writer",
		// 	"result" : "ok"
		// });
	}
});

module.exports = router;