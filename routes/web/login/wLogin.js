// login.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/web/login/wLogin');

// 시간변환
var moment = require('moment');

/*	로그인 요청 /login 들어온 경우 */
router.get('/wLogin', function (req, res) {
	res.render('loginForm', {title : '쓰담 로그인 페이지입니다.'});
});

router.post('/', function (req, res) {
	var email = req.body.userId;
	var pw = req.body.pw;

	// 유효성 검사
	if(email === undefined) {
		res.send('<script>alert("이메일을 입력해주세요.");</alert>');
	} else if(pw === undefined) {
		res.send('<script>alert("비밀번호를 입력해주세요.");</alert>');
	} else {
		var datas = [email, pw];

		db.login(datas, function (result) {
			// console.log('result : ',  result);
			if(result === 'DB_connection_error') {
				res.send('<script>alert("데이타 베이스 접근 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
			} else if(result === 'checkUser_error' ) {
				// email 값이 잘못되어 query 안된 경우
				res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
			} else if(result === 'No_value') {
				// id 틀린 경우
				res.send('<script>alert("존재하지 않는 회원입니다.");history.back();</script>');
			} else if(result === 'Recently_withdraw') {
				res.send('<script>alert("최근 탈퇴하였습니다. 1주일간 동일 아이디로 재가입이 불가능합니다.");history.back();</script>');
			} else if(result === 'pw_unmatch') {
				// 비밀번호 틀린 경우
				res.send('<script>alert("비밀번호가 올바르지 않습니다.");history.back();</script>');
			} else if(result.length == 0) {
				res.send('<script>alert("입력한 e-mail이 올바르지 않습니다.");history.back();</script>');
			} else {
				// id, pw 맞는 경우
				// session 에 필요한 값 넣음
				req.session.userId = result[0].email;
				req.session.birth = result[0].birth;
				// req.session.loginTime = moment().format('YYYY-MM-DD HH:mm:ss');

				console.log('userId : ', req.session.userId);
				// console.log('startAge : ', req.session.startAge);
				// console.log('endAge : ', req.session.endAge);
				// console.log('latitude : ', req.session.latitude);
				// console.log('logitude : ', req.session.logitude);
				// console.log('req.session.distance : ', req.session.distance);
				// console.log('req.session.pushId : ', req.session.pushId);
				// console.log('loginTime : ', req.session.loginTime);

				res.redirect('wList');
			}
		});
	}
});

module.exports = router;