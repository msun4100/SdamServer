var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/web/write/wArticle');

/* 모든 글 목록 */
router.post('/', function (req, res) {

	console.log('req.body : ', req.body);

	var userId = req.session.userId;
	var birth = req.session.birth;
	var content = req.body.content;
	var emotion = req.body.emotion;
	var category = req.body.emotion;
	var image = req.body.image;

	var now = new Date();
	var year = now.getFullYear();
	var birthValue = parseInt(birth, 10);

	var age = year - birthValue + 1;

	if(content === undefined || content === null) {
		res.send('<script>alert("글 내용을 제대로 입력해주세요");history.back();</alert>');
	} else {

		var datas = [userId, age, emotion, category, image, content];

		db.wArticle(datas, function (rows) {
			if(rows === 'DB_connection_error') {
				// DB 연결 error
				res.send('<script>alert("데이타 베이스 접근 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
			} else if (rows === 'getList_error') {
				// query error
				res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
			} else if(rows === 'goodCount_error') {
				// query error
				res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
			} else  if (rows === 'replyCount_error') {
				// query error
				res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
			} else {
				// 글 작성 성공
				res.redirect('/wList/1');
			}
		});
	}
});

module.exports = router;