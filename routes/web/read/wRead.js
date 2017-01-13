var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/web/read/wRead');

/* 글하나 읽기 */
router.get('/:page/:num', function (req, res) {

	var num = req.params.num;
	var page = req.params.page;

	// 글 하나 변수
	var article;

	var datas = [num];

	// 첫페이지 불러오기
	db.read(datas, function (data) {
		if(data === 'DB_connection_error') {
			// DB 연결 error
			res.send('<script>alert("데이타 베이스 접근 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</alert>');
		} else if (data === 'getList_error') {
			// query error
			res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</alert>');
		} else if(data === 'goodCount_error') {
			// query error
			res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</alert>');
		} else  if (data === 'replyCount_error') {
			// query error
			res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</alert>');
		} else {
			// 목록 불러오기 성공
			data.page = page;
			res.render('readForm', data);
		}
	});
});

module.exports = router;