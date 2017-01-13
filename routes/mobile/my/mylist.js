// mylist.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/my/mylist');
var db2 = require('../../../db_models/mobile/my/mylist2');
// 시간 계산 함수
var timeConverter = require('../../../function/timeConverter');
// json 생성
var articleJson = require('../../../function/articleJson');

router.get('/:num', function (req, res) {
	// 글의 위치값도 표시하기 위해 좌표값을 받는다
	var latitude = req.session.latitude;
	var logitude = req.session.logitude;

	var id = req.session.userId;

	// 여러번 새로고침 할 경우
	// 중복된 데이터를 불러오지 않기 위해
	// 마지막 요청으로 들어온 페이지값을 저장한다.
	var page = req.params.num;

	// 마지막으로 불러온 날짜값 저장하여 중복된 값 가져오지 않는다.
	var day;
	// 전달할 값
	var datas = [ latitude, logitude, id ];
	// 글 목록 넣을 변수
	var article;
	// 글 목록 값들의 배열
	var result=[];
	// 글번호 인덱스
	var index;

	if(page == 1) {	// 첫번째 요청
		// 첫페이지 불러오기
		db.mylist(datas, function (rows) {
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
					// json 객체 생성
					for(i=0; i<rows.length; i++) {
						result.push(articleJson(i, rows));
					}

					index = rows.length - 1;
					// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
					day = rows[index].postTime;
					day = timeConverter(day);

					req.session.myDay = timeConverter(rows[0].postTime);	// 서버에 시간값 저장
					req.session.myDay2 = day;

					req.session.mPage = page;

					// console.log('result : ', result);
					// json 객체 응답
					res.json({
						"success" : 1,
						"work" : "new",
						"result" : result
					});
				} else {
					// 불러올 값이 없는 경우
					res.json({
						"success" : 1,
						"work" : "new",
						"result" : null
					});
				}
			}
		});
	} else if(page != req.session.mPage) {
		// 첫번째 요청 이후
		// 첫페이지 이후 값 불러오기
		req.session.myDay = req.session.myDay2;
		day = req.session.myDay2;
		datas.push(day);

		db2.mylist2(datas, function (rows) {
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
				if(rows.length >0) {
					// 값이 존재하는 경우
					// json 객체 생성
					for(i=0; i<rows.length; i++) {
						result.push(articleJson(i, rows));
					}

					index = rows.length - 1;
					// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
					day = rows[index].postTime;
					day = timeConverter(day);

					req.session.myDay2 = day;

					req.session.mPage = page;

					// console.log('result : ', result);
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
	} else if(page == req.session.mPage) {
		// 같은 페이지 재요청할 경우
		day = req.session.myDay;
		datas.push(day);

		db2.mylist2(datas, function (rows) {
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
				if(rows.length >0) {
					// 값이 존재하는 경우
					// json 객체 생성
					for(i=0; i<rows.length; i++) {
						result.push(articleJson(i, rows));
					}

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