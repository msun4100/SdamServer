// distance.js

var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/distance/distance');

/* 피드 범위의 위치정보만 수정 */
router.post('/', function (req, res) {
	var id = req.session.userId;	// 사용자 id
	var distance = req.body.distance;	// 거리범위

	console.log('distance : ', distance);

	if(distance === undefined) {
		res.json({
			"success" : 0,
			"work" : "distance_undefined",
			"result" : null
		});
	} else {
		// 값을 제대로 받은 경우
		// DB query 실시
		var datas = [distance, id];
		db.distance(datas, function(result){
			if(result === 'DB_connection_error') {
				// DB 연결 실패
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === 'distance_error') {
				// query 실패
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === true) {
				// query 성공
				req.session.distance = distance;
				res.json({
					"success" : 1,
					"work" : "distance",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;