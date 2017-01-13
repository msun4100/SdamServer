var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/web/list/wNotice');

/* 모든 글 목록 */
router.get('/:page', function (req, res) {

	var page = req.params.page;

	// 첫페이지 불러오기
	db.notice(page, function (rows) {
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
			// 목록 불러오기 성공
			res.render('noticeListForm', rows);
		}
	});
});

module.exports = router;