// contentSearch.js

var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/search/contentSearch');
var db2 = require('../../../db_models/mobile/search/contentSearch2');

// JSON 함수
var articleJson = require('../../../function/articleJson');
// 시간 변환 함수
var timeConverter = require('../../../function/timeConverter');

router.get('/:contentValue/:num', function (req, res) {
	// 검색할 내용
	var value = '%' + req.params.contentValue + '%';
	// 페이지 값
	var page = req.params.num;

	// 좌표값
	var latitude = req.session.latitude;
	var logitude = req.session.logitude;

	var userId = req.session.userId;

	var day;

	var datas = [ latitude, logitude, value, userId ];

	if(value === undefined) {
		res.json({
			"success" : 0,
			"work" : "search_value_undefined",
			"result" : null
		});
	} else if(page === undefined) {
		res.json({
			"success" : 0,
			"work" : "page_undefined",
			"result" : null
		});
	} else {
		// DB 검색 실시
		if(page == 1) {
			// 첫번째 페이지
			db.contentSearch(datas, function (result) {
				if(result === 'DB_connection_error') {
					res.json({
						"success" : 0,
						"work" : result,
						"result" : null
					});
				} else if(result === 'getList_error') {
					res.json({
						"success" : 0,
						"work" : result,
						"result" : null
					});
				} else if(result === 'myGoodCheck_error') {
					res.json({
						"success" : 0,
						"work" : result,
						"result" : null
					});
				} else {
					// 값 가져온 경우
					if(result.length > 0) {
						var article = [];
						for(i=0; i<result.length; i++) {
							article.push(articleJson(i, result));
						}

						var index = result.length - 1;
						// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
						day = result[index].postTime;
						day = timeConverter(day);

						req.session.sDay = timeConverter(result[0].postTime);
						req.session.sDay2 = day;

						req.session.sPage = page;

						// json 객체 응답
						res.json({
							"success" : 1,
							"work" : "contentSearch",
							"result" : article
						});
					} else {
						// 가져온 값이 없을 경우
						res.json({
							"success" : 1,
							"work" : "contentSearch",
							"result" : null
						});
					}
				}
			});
		} else if(page != req.session.sPage) {
			// 그 이후
			// 서버에 저장된 값 이 후의 값만 가져온다.
			req.session.sDay = req.session.sDay2;
			day = req.session.sDay2;

			datas.push(day);
			db2.contentSearch2(datas, function (result) {
				if(result === 'DB_connection_error') {
					res.json({
						"success" : 0,
						"work" : result,
						"result" : null
					});
				} else if(result === 'getList_error') {
					res.json({
						"success" : 0,
						"work" : result,
						"result" : null
					});
				} else if(result === 'myGoodCheck_error') {
					res.json({
						"success" : 0,
						"work" : result,
						"result" : null
					});
				} else {
					if(result.length > 0) {
						var article = [];
						for(i=0; i<result.length; i++) {
							article.push(articleJson(i, result));
						}

						var index = result.length - 1;
						// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
						day = result[index].postTime;
						day = timeConverter(day);

						req.session.sDay2 = day;

						req.session.sPage = page;

						// json 객체 응답
						res.json({
							"success" : 1,
							"work" : "contentSearch",
							"result" : result
						});
					} else {
						res.json({
							"success" : 1,
							"work" : "contentSearch",
							"result" : null
						});
					}
				}
			});
		} else if(page == req.session.sPage) {
			// 같은 페이지 재요청할 경우
			day = req.session.sDay;
			datas.push(day);

			db2.contentSearch2(datas, function (rows) {
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
	}
});

module.exports = router;