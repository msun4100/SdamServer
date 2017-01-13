var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/web/list/wList');

/* 모든 글 목록 */
router.get('/:page', function (req, res) {

	var page = req.params.page;

	// 첫페이지 불러오기
	db.list(page, function (datas) {
		if(datas === 'DB_connection_error') {
			// DB 연결 error
			res.send('<script>alert("데이타 베이스 접근 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
		} else if (datas === 'getList_error') {
			// query error
			res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
		} else if(datas === 'goodCount_error') {
			// query error
			res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
		} else  if (datas === 'replyCount_error') {
			// query error
			res.send('<script>alert("데이타 베이스 작업 중 오류가 발생했습니다.\n다시 시도해주세요.");history.back();</script>');
		} else {
			// 목록 불러오기 성공
			// DB 쿼리시 datas = {} 안에 JSON형식으로 값을 넣은 뒤 datas를 반환
			// datas 는 JSON 형식, 자세한 형식은 DB 파일 참조
			// console.log('datas : ', datas);
			res.render('listForm', datas);
		}
	});
});

module.exports = router;