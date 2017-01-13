// around.js

var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/list/around');
// articleJson
var articleJson = require('../../../function/articleJson');

/* 글 읽어올 때 baord 테이블의 prior컬럼 1인 글은 읽어오지 않도록 한다.
	DB설정 후 DB 에서 불러온 값이 null인지 아닌지 확인하여
	잘못된 값을 보내지 않도록 검사해야 한다. */

/* 주변 글 목록 */
router.get('/', function (req, res) {
	// 글의 위치값도 표시하기 위해 좌표값을 받는다
	var latitude = req.session.latitude;
	var logitude = req.session.logitude;
	// 설정한 나이값에 맞는 글만 가져오기 위해 나이값 확인
	var startAge = req.session.startAge;
	var endAge = req.session.endAge;
	// 피드 범위 불러온다.
	var distance = req.session.distance;
	var id = req.session.userId;

	// 전달할 값
	var datas = [ latitude, logitude, startAge, endAge, distance, id];;
	// 글 목록 넣을 변수
	var article;
	// 글 목록 값들의 배열
	var result=[];
	// 주변 글은 반드시 최신 이야기를 불러오지 않아도 된다.

	// console.log('datas : ', datas);
	// 첫페이지 불러오기
	db.around(datas, function (rows) {
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
			// 목록 불러오기 성공
			if(rows.length !== 0) {
				// 받은 글 목록이 있는 경우
				// json 객체 생성
				for(i=0; i<rows.length; i++) {
					result.push(articleJson(i, rows));
				}

				// json 객체 응답
				res.json({
					"success" : 1,
					"work" : "around",
					"result" : result
				});
			} else {
				// 받은 글 목록이 없는 경우
				// 마지막 페이지까지 다 본 경우
				res.json({
					"success" : 1,
					"work" : "around",
					"result" : null
				});
			}
		}
	});
});

module.exports = router;