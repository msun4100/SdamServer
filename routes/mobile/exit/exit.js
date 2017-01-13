// exit.js
var express = require('express');
var router = express.Router();
var session = require('express-session');

// DB 객체
var db = require('../../../db_models/mobile/exit/exit');
var moment = require('moment');

// 종료시 현재시각 member에 입력
// 종료시 작성한 글, 댓글, 좋아요 계산하여 점수 UPDATE
// session destroy 실시
router.post('/', function (req, res) {
	var userId = req.session.userId;
	// 나가는 시각 확인, MySQL date 형식으로 변경
	var lastLogin = moment().format('YYYY-MM-DD');
	// console.log('lastLogin : ', lastLogin);

	if(userId === undefined) {
		res.json({
			"success" : 0,
			"work" : "userId_undefined",
			"result" : null
		});
	} else if(lastLogin === undefined) {
		res.json({
			"success" : 0,
			"work" : "loginTime_undefined",
			"result" : null
		});
	} else {
		// DB 작업
		var datas = [lastLogin, userId];
		db.exit(datas, function (result) {
			if(result === 'updateLoginDate_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'No_value') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				// DB 업데이트 완료, 앱 종료
				// req.session.destroy(function (err) {
				// 	if(err) console.log('err : ', err);
				// });
				res.json({
					"success" : 1,
					"work" : "exit",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;