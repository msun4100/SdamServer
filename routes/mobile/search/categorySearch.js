// category.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/search/categorySearch');
var db2 = require('../../../db_models/mobile/search/categorySearch2');

// 시간 변환 함수
var timeConverter = require('../../../function/timeConverter');
// articleJson
var articleJson = require('../../../function/articleJson');

// 카테고리 검색 또는 선택하여 진입
// 카테고리 검색 후 또는 선택 후 해당 정보를 받은 후 뿌려준다.
router.get('/:cName/:num', function (req, res) {
	// 글의 위치값도 표시하기 위해 좌표값을 받는다
	var latitude = req.session.latitude;
	var logitude = req.session.logitude;
	// 설정한 나이값에 맞는 글만 가져오기 위해 나이값 확인
	var startAge = req.session.startAge;
	var endAge = req.session.endAge;

	var id = req.session.userId;

	// 여러번 새로고침 할 경우
	// 중복된 데이터를 불러오지 않기 위해
	// 마지막 요청으로 들어온 페이지값을 저장한다.
	var num = req.params.num;
	// category 이름
	var category = req.params.cName;

	// 마지막으로 불러온 날짜값 저장하여 중복된 값 가져오지 않는다.
	var day;
	// 전달할 값
	var datas = [];
	// 글 목록 넣을 변수
	var article;
	// 글 목록 값들의 배열
	var result=[];

	if(num == 1) {	// 첫번째 요청
		datas = [ latitude, logitude, startAge, endAge, id, category ];
		// 첫페이지 불러오기
		db.category(datas, function (rows) {
			if(rows === 'DB_connection_error') {
				// DB 연결 error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else if (rows === 'SELECT_query_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else  if (rows === 'SELECT_COUNT_goodwirte_query_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else if(rows === 'SELECT_COUNT_reply_num_query_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else {
				// 목록 불러오기 성공
				// json 객체 생성
				for(i=0; i<rows.length; i++) {
					result.push(articleJson(i, rows));
				}

				var index = rows.length - 1;
				// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
				day = rows[index].postTime;
				day = timeConverter(day);

				// json 객체 응답
				res.json({
					"success" : 1,
					"work" : "new",
					"result" : result
				});
				// console.log('result : ', result);
			}
		});
		req.session.day = day;	// 서버에 시간값 저장

	} else {
		// 첫번째 요청 이후
		// 첫페이지 이후 값 불러오기
		day = req.session.day;
		datas = [ latitude, logitude, startAge, endAge, day, id, category ];

		db2.category2(datas, function (rows) {
			if(rows === 'DB_connection_error') {
				// DB 연결 error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else if (rows === 'SELECT_query_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else  if (rows === 'SELECT_COUNT_goodwirte_query_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else if(rows === 'SELECT_COUNT_reply_num_query_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else {
				// 목록 불러오기 성공
				if(rows.length > 0) {
					// 값이 존재하는 경우
					// json 객체 생성
					for(i=0; i<rows.length; i++) {
						result[i] = articleJson(i, rows);
					}

					var index = rows.length - 1;
					// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
					day = rows[index].postTime;
					day = timeConverter(day);

					req.session.day = day;

					// json 객체 응답
					res.json({
						"success" : 1,
						"work" : "new",
						"result" : result
					});
				} else {
					// 마지막 데이타를모두 전달하여 값이 없는 경우
					res.json({
						"success" : 1,
						"work" : "new",
						"result" : null
					});
				}
			}
		});
	}
});

module.exports = router;