// set.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/set/set');

// 피드 범위 설정
router.post('/', function (req, res) {
	var id = req.session.userId;
	var startAge = req.body.startAge;
	var endAge = req.body.endAge;
	var distance = req.body.distance;

	// var id = req.body.userId;
	// var startAge = req.body.startAge;	// 최소 나이값
	// var endAge = req.body.endAge;	// 최대 나이값
	// var distance = req.body.distance;	// 거리범위

	// console.log('id : ', id);
	// console.log('startAge : ', startAge);
	// console.log('endAge : ',endAge);
	// console.log('distance : ', distance);

	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else if(startAge === undefined) {
		res.json({
			"success" : 0,
			"work" : "startAge_undefined",
			"result" : null
		});
	} else if(endAge === undefined) {
		res.json({
			"success" : 0,
			"work" : "endAge_undefined",
			"result" : null
		});
	} else if(distance === undefined) {
		res.json({
			"success" : 0,
			"work" : "distance_undefined",
			"result" : null
		});
	} else {
		// 값을 제대로 받은 경우
		// DB query 실시
		var datas = [startAge, endAge, distance, id];

		db.set(datas, function(result){
			if(result === 'DB_connection_error') {
				// DB 연결 실패
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === 'set_error') {
				// query 실패
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === true) {
				// query 성공
				// session 에 저장된 피드범위 갱신
				req.session.distance = distance;
				req.session.startAge = startAge;
				req.session.endAge = endAge;
				// json  응답
				res.json({
					"success" : 1,
					"work" : "set",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;