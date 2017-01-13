// login.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/login/login');
var db2 = require('../../../db_models/mobile/login/pushUpdate');
// 시간변환
var moment = require('moment');

/*	로그인 요청 /login 들어온 경우 */
router.post('/', function (req, res) {
	var email = req.body.userId;
	var pw = req.body.pw;
	// 로그인시 위도 경도값 받아온다.
	var latitude = req.body.latitude;
	var logitude = req.body.logitude;
	// push 아이디도 받는다
	var pushId = req.body.pushId;

	// console.log('latitude : ', latitude);
	// console.log('logitude : ', logitude);

	// 유효성 검사
	if(email === undefined) {
		res.json({
			"success" : 0,
			"work" : "email_undefined",
			"result" : null
		});
	} else if(pw === undefined) {
		res.json({
			"success" : 0,
			"work" : "pw_undefined",
			"result" : null
		});
	} else if(pushId === undefined) {
		res.json({
			"success" : 0,
			"work" : "pushId_undefined",
			"result" : null
		});
	} else {
		var datas = [email, pw, pushId];

		db.login(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkUser_error' ) {
				// email 값이 잘못되어 query 안된 경우
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'No_value') {
				// id 틀린 경우
				res.json({
					"success" : 0,
					"work" : "존재하지 않는 회원입니다.\n회원가입을 후 이용해주시기 바랍니다.",
					"result" : null
				});
			} else if(result === 'Recently_withdraw') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'pw_unmatch') {
				// 비밀번호 틀린 경우
				res.json({
					"success" : 0,
					"work" : "비밀번호가 일치하지 않습니다.",
					"result" : null
				});
			} else if(result === 'unknown_login_error') {
				// 알 수 없는 오류
				res.json({
					"success" : 0,
					"work" : "로그인 정보와 관련된 오류가 발생했습니다.\n관리자에게 문의하시기 바랍니다.",
					"result" : null
				});
			} else if(result === 'pushId_Update_error') {
				// PushId 업데이트 오류
				res.json({
					"success" : 0,
					"work" : "푸시정보를 업데이트 하는 도중 오류가 발생했습니다.\n로그인을 다시 시도해주시기 바랍니다.",
					"result" : null
				});
			} else if(result.length == 0) {
				res.json({
					"success" : 0,
					"work" : "입력한 E-mail이 존재하지 않습니다.",
					"result" : null
				});
			} else {
				// id, pw 맞는 경우
				// session 에 필요한 값 넣음
				req.session.userId = result[0].email;
				req.session.startAge = result[0].start_age;
				req.session.endAge = result[0].end_age;
				req.session.birth = result[0].birth;
				req.session.distance = result[0].distance;
				req.session.latitude = latitude;
				req.session.logitude = logitude;
				req.session.pushId = pushId;
				// req.session.loginTime = moment().format('YYYY-MM-DD HH:mm:ss');

				console.log('userId : ', req.session.userId);
				// console.log('startAge : ', req.session.startAge);
				// console.log('endAge : ', req.session.endAge);
				// console.log('active : ', req.session.active);
				// console.log('age : ', req.session.age);
				// console.log('latitude : ', req.session.latitude);
				// console.log('logitude : ', req.session.logitude);
				// console.log('req.session.distance : ', req.session.distance);
				// console.log('req.session.pushId : ', req.session.pushId);
				// console.log('loginTime : ', req.session.loginTime);

				// 마지막으로 로그인한 날짜와 오늘 날짜 차이 loginDate
				var lastLogin = result[0].loginDate;

				var temp = parseInt(lastLogin, 10);
				lastLogin = temp;

				// 오늘 날짜와 마지막 로그인 날짜 차이에 따라 work 값 0 또는 1
				// 차이 7일 이상 1
				// 차이 7일 미만 0
				if(lastLogin >= 7) {
					// 성공시
					res.json({
						"success" : 1,
						"work" : "1",
						"result" : null
					});
				} else {
					// 성공시
					res.json({
						"success" : 1,
						"work" : "0",
						"result" : null
					});
				}
			}
		});
	}
});

module.exports = router;