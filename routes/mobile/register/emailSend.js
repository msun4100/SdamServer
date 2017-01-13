// emailAuth.js

var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();


var db = require('../../db_modules/register/emailSend');

// url에 생성된 authNum을 보내고
// 이를 받아온 후 DB에 저장된 난수 값과 비교하여
// 동일하면 인증 완료
router.post('/', function(req, res) {
	// var userId = req.body.userId;
	// var authNum = req.body.authNum;
	var userId = req.session.userId;
	console.log('req.session.userId : ', req.session.userId);
	// 1000~9999 까지 난수
	var authNum = Math.floor(Math.random()*(9999-1000 +1 )) + 1000;
	// authNum 값을 DB에 넣어줘야 한다.
	console.log('authNum : ', authNum);

	var sender = "sdamkorea@gmail.com";
	var subject = "쓰담 인증메일입니다.";

	var content = "";	// 메일의 내용, html 형식
	content = '<html>아래의 링크를 누르면 인증이 완료됩니다.<br><a href = "http://54.186.98.145/emailauth/' + authNum +'">쓰담 인증</a></html>';

	var transporter = nodemailer.createTransport({
		service : 'gmail',
		auth : {
			user : 'sdamkorea@gmail.com',
			pass : 'rudehwns'
			}
	});

	var mailOptions = {
		from : sender,
		to : userId,
		subject : subject,
		html : content
	};
	console.log('content : ', content);

	var datas = [authNum, userId];
	db.authStart(datas, function (result) {
		if(result) {
			// DB에 authNum 입력 성공
			transporter.sendMail(mailOptions, function (err, info) {
				if(err) {
					res.json({
						// 메일전송 실패시
						"success" : 0,
						"work" : "emailSend",
						"result" : err
					});
					console.log('err : ', err);
				} else {
					// 메일전송 완료시
					res.json({
						"success" : 1,
						"work" : "emaillSend",
						"result" : "ok"
					});
					console.log('Message sent : ' + info.response);
				}
			});
		} else {
			// DB에 authNum 입력 실패
			res.json({
				"success" : 0,
				"work" : "emailSend",
				"result" : "DB_connection_error"
			});
		}
	});




	/* 인증 실패시
	res.json({
		"success" : 0,
		"work" : "emailAuth",
		"result" : "timeOut"
	}); */

});

module.exports = router;