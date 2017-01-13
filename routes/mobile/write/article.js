// write.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/write/article');

// 글 쓰기
router.post('/', function (req, res) {
	var userId = req.session.userId;	// session에 저장된 id이용
	var latitude = req.session.latitude;	// session에 저장된 위치정보 이용
	var logitude = req.session.logitude;	// session에 저장된 위치정보 이용
	var birth = req.session.birth;	// session에 저장된 정보
	var content = req.body.content;	// 클라이언트에서 받은 정보
	var emotion = req.body.emotion;	// 클라이언트에서 받은 정보
	var unlocate = req.body.unlocate;	// 클라이언트에서 받은 정보
	var lock = req.body.lock;	// 클라이언트에서 받은 정보
	var category = req.body.category;	// 클라이언트에서 받은 정보
	var image = req.body.image;	// 클라이언트에서 받는 정보

	// console.log('content : ', content);
	// console.log('userId : ', userId);
	// console.log('unlocate : ', unlocate);
	// console.log('lock : ', lock);
	// console.log('latitude : ', latitude);
	// console.log('logitude : ', logitude);
	// console.log('birth : ', birth);
	// console.log('category : ', category);
	// console.log('image : ', image);

	// 글작성시에는 생년이 아닌 나이값으로 들어가므로 변환
	var now = new Date();
	var year = now.getFullYear();
	var birthValue = parseInt(birth, 10);

	var age = year - birthValue + 1;

	if(content === undefined) {
		res.json({
			"success" : 0,
			"work" : "content_undefined",
			"result" : null
		});
	} else if(userId === undefined) {
		res.json({
			"success" : 0,
			"work" : "userId_undefined",
			"result" : null
		});
	} else if(age === undefined) {
		res.json({
			"success" : 0,
			"work" : "age_undefined",
			"result" : nul
		});
	} else if(emotion === undefined) {
		res.json({
			"success" : 0,
			"work" : "emotion_undefined",
			"result" : null
		});
	} else if(unlocate === undefined) {
		res.json({
			"success" : 0,
			"work" : "unlocate_undefined",
			"result" : null
		});
	} else if(lock === undefined) {
		res.json({
			"success" : 0,
			"work" : "lock_undefined",
			"result" : null
		});
	} else if(category === undefined) {
		res.json({
			"success" : 0,
			"work" : "category_undefined",
			"result" : null
		});
	} else if(image === undefined) {
		res.json({
			"success" : 0,
			"work" : "image_undefined",
			"result" : null
		});
	} else if(latitude === undefined) {
		latitude = null;
	} else if(logitude === undefined) {
		logitude = null;
	} else if(unlocate === "1") {
		// 값을 제대로 받은 경우 DB query
		req.session.latitude = latitude;
		req.session.logitude = logitude;
		var datas = [userId, null, null, age, emotion, content, unlocate, lock, category, image];

		db.article(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'writeArticle_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkCalendar_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'updateCalendar_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === true) {
				// 성공시
				res.json({
					"success" : 1,
					"work" : "write_article",
					"result" : "ok"
				});
			}
		});
	} else {
		// 값을 제대로 받은 경우 DB query
		req.session.latitude = latitude;
		req.session.logitude = logitude;

		var datas = [userId, latitude, logitude, age, emotion, content, unlocate, lock, category, image];

		db.article(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'writeArticle_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkCalendar_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'updateCalendar_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === true) {
				// 성공시
				res.json({
					"success" : 1,
					"work" : "write_article",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;