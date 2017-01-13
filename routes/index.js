var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: '쓰담' });
});

/* 회원가입 요청 */
router.get('/wRegister', function (req, res) {
	res.render('registerForm', {title : '쓰담 회원가입 페이지입니다.'});
});

/*	로그인 요청 */
router.get('/wLogin', function (req, res) {
	res.render('loginForm', {title : '쓰담 로그인 페이지입니다.'});
});

/* 글목록 요청 */
router.get('/wList', function (req, res) {
	res.redirect('/wList/1');
});

/* 공지사항 목록 */
router.get('/wNotice', function (req, res) {
	res.redirect('/wNotice/1');
});

/* 공지 작성 */
router.get('/wNWrite', function (req, res) {
	res.render('noticeWriteForm');
});

/* 글작성 */
router.get('/wArticle', function (req, res) {
	res.render('writeForm');
});

/* 글하나 읽기 */
router.get('/wRead', function (req, res) {
	res.render('readForm');
});

/* 회원 목록 */
router.get('/wMemList', function (req, res) {
	res.redirect('/wMemList/1');
});


module.exports = router;