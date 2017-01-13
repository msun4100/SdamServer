var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
// DB
var db = require('../../../db_models/web/register/wRegister');

router.post('/', function (req, res) {
	var email = req.body.userId;
	var pw = req.body.pw;
	var birth = req.body.birth;
	var sex = req.body.sex;
	var pushId = null;

	// DB에 들어가는 값은 int 이므로 형변환
	var temp = parseInt(sex, 10);
	sex = temp;

	// 암호화
	var salt = bcrypt.genSaltSync(10);
	var password = bcrypt.hashSync(pw, salt);

	if(email === undefined) {
		res.send('<script>alert("이메일을 입력해주세요.");</script>');
	} else if(birth === undefined) {
		res.send('<script>alert("태어난 해를 입력해주세요.");</script>');
	} else if(sex === undefined) {
		res.send('<script>alert("성별을 선택해주세요.");</script>');
	} else if(sex > 2) {
		res.send('<script>alert("올바르지 않은 값이 입력되었습니다.\n다시 회원가입을 해주세요.");history.back();</script>');
	} else if(password === undefined) {
		res.send('<script>alert("비밀번호를 입력해주세요.");</script>');
	} else {
		var datas = [email, birth,  sex, pushId, password];
		console.log("datas: ",datas);
		db.register(datas, function (result) {
			if(result === 'DB_connection_error') {
				// DB 접속에 실패한 경우
				res.send('<script>alert("회원가입에 실패했습니다. 이전 페이지로 돌아갑니다.");history.back();</script>');
			} else if(result === 'checkData_error') {
				// id 중복확인 query 실패
				res.send('<script>alert("회원가입에 실패했습니다. 이전 페이지로 돌아갑니다.");history.back();</script>');
			} else if(result === 'userEmail_duplicated') {
				// DB에 접속했으나 id값 중복인 경우
				res.send('<script>alert("중복된 id값 입니다. 이전 페이지로 돌아갑니다.");history.back();</script>');
			} else if(result === 'regMember_error') {
				res.send('<script>alert("회원가입에 실패했습니다. 이전 페이지로 돌아갑니다.");history.back();</script>');
			} else if(result === 'unknown_error') {
				res.send('<script>alert("회원가입에 실패했습니다. 이전 페이지로 돌아갑니다.");history.back();</script>');
			} else {
				res.redirect('/wLogin');
			}
		});
	}
});


module.exports = router;