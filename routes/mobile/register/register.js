// register.js
var express = require('express');
var router = express.Router();
// DB연결파일 위치 설정
var db = require('../../../db_models/mobile/register/register');
// 암호화를 위한 변수 bcrypt
var bcrypt = require('bcrypt');

/* 회원가입 요청 register 들어온 경우 */
router.post('/', function (req, res) {
	var email = req.body.userId;
	var pw = req.body.pw;
	var birth = req.body.birth;
	var sex = req.body.sex;
	var pushId = req.body.pushId;

	// DB에 들어가는 값은 int 이므로 형변환
	var temp = parseInt(sex, 10);
	sex = temp;

	// 암호화
	var salt = bcrypt.genSaltSync(10);
	var password = bcrypt.hashSync(pw, salt);

	// 유효성 검사
	if(email === undefined) {
		res.json({
			"success" : 0,
			"work" : "email_undefined",
			"result" : null
		});
	} else if(birth === undefined) {
			res.json({
				"success" : 0,
				"work" : "birth_undefined",
				"result" : null
			});
	} else if(sex === undefined) {
		res.json({
			"success" : 0,
			"work" : "sex_undefined",
			"result" : null
		});
	} else if(sex > 2) {
		res.json({
			"success" : 0,
			"work" : "sex_value_error",
			"result" : null
		});
	} else if(pushId === undefined) {
		pushId = null;
	} else if(password === undefined) {
		res.json({
			"success" : 0,
			"work" : "hash_error",
			"result" : null
		});
	} else {
		// 값이 온전히 올라온 경우
		var datas = [email, birth,  sex, pushId, password];
		console.log('datas : ', datas);

		// 회원가입 작업 실시
		db.register(datas, function (result) {
			if(result === 'DB_connection_error') {
				// DB 접속에 실패한 경우
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkData_error') {
				// id 중복확인 query 실패
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'userEmail_duplicated') {
				// DB에 접속했으나 id값 중복인 경우
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'regMember_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'unknown_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				res.json({
					"success" : 1,
					"work" : "register",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;