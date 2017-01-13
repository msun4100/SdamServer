// issue.js
var express = require('express');
var router = express.Router();


// DB 연결
var db = require('../../../db_models/mobile/list/issue');
// articleJson
var articleJson = require('../../../function/articleJson');

/* 글 읽어올 때 baord 테이블의 prior컬럼 1인 글은 읽어오지 않도록 한다.
	DB설정 후 DB 에서 불러온 값이 null인지 아닌지 확인하여
	잘못된 값을 보내지 않도록 검사해야 한다. */

/* 인기있는 글 목록 */
router.get('/', function (req, res) {
	var latitude = req.session.latitude;	// session에 저장된 값
	var logitude = req.session.logitude;	// session 에 저장된 값
	var id = req.session.userId;	// session에 저장된 값

	var datas = [latitude, logitude, id];
	// console.log('datas : ', datas);

	db.issue(datas, function (rows) {
		if(rows === 'DB_connection_error') {
			// DB 연결 error
			res.json({
				"success" : 0,
				"work" : rows,
				"result" : null
			});
		} else if (rows === 'getList_error') {
			// query error
			res.json({
				"success" : 0,
				"work" : rows,
				"result" : null
			});
		} else if(rows === 'myGoodCheck_error') {
			// query error
			res.json({
				"success" : 0,
				"work" : rows,
				"result" : null
			});
		} else {
			result = [];
			// query 성공
			if(rows.length !== 0) {
				// 받은 글 목록이 있는 경우
				// json 객체 생성
				for(i=0; i<rows.length; i++) {
					result.push(articleJson(i, rows));
				}

				// console.log('result : ', result);
				// json 객체 응답
				res.json({
					"success" : 1,
					"work" : "issue",
					"result" : result
				});
			} else {
				// 받은 글 목록이 없는 경우
				// 마지막 페이지까지 다 본 경우
				res.json({
					"success" : 1,
					"work" : "issue",
					"result" : null
				});
			}
		}
	});
});


module.exports = router;