// findpw.js

// 임시비밀번호를 메일로 전송해주는 기능
var express = require('express');
var router = express.Router();
// 메일 전송
var nodemailer = require('nodemailer');
// 암호화
var bcrypt = require('bcrypt');
var db = require('../../../db_models/mobile/findpw/findpw');
// 메일 내용
var mailContent = require('./mailContent');
// 무작위 string 생성
var randomString = require('../../../function/randomString');

router.post('/', function (req, res) {
	// user Email
	var userId = req.body.userId;
	// 무작위 string 생성
	var randomValue = randomString(8);
	// 난수 암호화
	var salt = bcrypt.genSaltSync(10);
	// 임시 비밀번호
	var tempPw = bcrypt.hashSync(randomValue, salt);

	if(userId == undefined) {
		res.json({
			"success" : 0,
			"work" : "userId_undefined",
			"result" : null
		});
	} else if(tempPw === undefined) {
		res.json({
			"success" : 0,
			"work" : "tempPw_undefined",
			"result" : null
		});
	} else if(tempPw === undefined) {
		res.json({
			"success" : 0,
			"work" : "hash error",
			"result" : null
		});
	} else {
		// DB 비밀번호 변경
		var datas = [tempPw, userId];
		console.log('datas : ', datas);

		db.findpw(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'UPDATE_query_error') {
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
			} else if(result === true) {

				// 임시비밀번호를 해당 email 로 전송
				var sender = "sdamkorea@gmail.com";
				var subject = "쓰담 임시 비밀번호 발급 편지입니다";
				var html = mailContent(randomValue);

				// 보내는 사람의 로그인 정보
				var transporter = nodemailer.createTransport({
					service : 'gmail',
					auth : {
						user : 'sdamkorea@gmail.com',
						pass : 'rudehwns'
						}
				});

				// 이메일 설정
				var mailOptions = {
					from : sender,
					to : userId,
					subject : subject,
					html : html
				};

				// 메일 전송
				transporter.sendMail(mailOptions, function (err, info) {
					if(err) {
						// 메일전송 실패시
						res.json({
							"success" : 0,
							"work" : "Email_send_error",
							"result" : null
						});
						console.log('err : ', err);
					} else {
						// 메일전송 성공시
						res.json({
							"success" : 1,
							"work" : "findpw",
							"result" : "ok"
						});
					}
				});
			}
		});
	}
});

module.exports = router;