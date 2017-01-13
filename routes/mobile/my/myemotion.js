// myemotion.js

var express = require('express');
var router = express.Router();

// 시간 변환 함수
var timeConverter = require('../../../function/timeConverter');
// json 생성
var articleJson = require('../../../function/articleJson');

// DB 연결
var db = require('../../../db_models/mobile/my/myemotion');
var db2 = require('../../../db_models/mobile/my/myemotion2');

// 내가 해당 감정으로 쓴 글
router.get('/:emotion/:num', function (req, res) {
	var id = req.session.userId;		// session에 저장된값
	var emotion = req.params.emotion;
	var page = req.params.num;	// page 값
	var latitude = req.session.latitude;	// session에 저장된 값
	var logitude = req.session.logitude;	// session에 저장된 값

	var result = [];
	var datas = [latitude, logitude, id, emotion];
	var num;
	var index;

	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else if(page === undefined) {
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else {
		// 값 제대로 받은 경우
		if(page == 1) {	// 첫번째 요청
			// 첫페이지 불러오기
			db.myemotion(datas, function (rows) {
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

						req.session.eDay = timeConverter(rows[0].postTime);	// 서버에 시간값 저장
						req.session.eDay2 = day;

						req.session.ePage = page;

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
		} else if(page != req.session.ePage) {
			// 첫번째 요청 이후
			// 첫페이지 이후 값 불러오기
			req.session.eDay = req.session.eDay2;
			day = req.session.eDay2;
			datas.push(day);

			db2.myemotion2(datas, function (rows) {
				console.log("rows", rows);
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

						req.session.eDay2 = day;

						req.session.ePage = page;

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
		} else if(page == req.session.ePage) {
			// 같은 페이지 재요청할 경우
			day = req.session.eDay;
			datas.push(day);

			db2.myemotion2(datas, function (rows) {
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


// 내가 쓴 글 목록
// router.get('/:emotion/:num', function (req, res) {
// 	var num = req.params.num;
// 	var emotion = req.params.emotion;
// 	var id = req.session.userId;	//session에 저장된 값
// 	var latitude = req.session.latitude;
// 	var logitude = req.session.logitude;

// 	var result = [];

// 	// 마지막으로 불려온 글의 시간값 저장할 변수
// 	var day;
// 	// 전달할 datas
// 	var datas = [latitude, logitude, id, emotion];

// 	if(id === undefined) {
// 		res.json({
// 			"success" : 0,
// 			"work" : "id_undefined",
// 			"result" : null
// 		});
// 	} else if(emotion === undefined) {
// 		res.json({
// 			"success" : 0,
// 			"work" : "emotion_undefined",
// 			"result" : null
// 		});
// 	} else {
// 		// 값을 제대로 받은 경우

// 		// num 값이 1이면 처음 불러오는 경우
// 		if(num == 1) {
// 			db.emotion(datas, function (rows) {
// 				if(rows === 'repList_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'goodList_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'getList_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'goodCount_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'replyCount_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else {
// 					// 성공
// 					// json 객체 생성
// 					if(rows.length > 0) {
// 						for(i=0; i<rows.length; i++) {
// 							result.push(articleJson(i, rows));
// 						}

// 						var index = rows.length - 1;
// 						// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
// 						day = rows[index].postTime;
// 						day = timeConverter(day);
// 						// 시간값 서버에 저장
// 						req.session.day = day;

// 						// json 객체 응답
// 						res.json({
// 							"success" : 1,
// 							"work" : "myemotion",
// 							"result" : result
// 						});
// 					} else {
// 						// 마지막 페이지까지 보내어 더이상 값이 없는 경우
// 						// null 값을 반환하므로
// 						res.json({
// 							"success" : 1,
// 							"work" : "myemotion",
// 							"result" : null
// 						});
// 					}
// 				}
// 			});
// 		} else {
// 			day = req.session.day;	// 서버에 저장한 시간값 가져온다.
// 			datas.push(day);	// 전달배열에 추가
// 			console.log('datas :', datas);
// 			// num 이 1보다 큰 경우
// 			db2.emotion2(datas, function (rows) {
// 				if(rows === 'repList_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'goodList_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'getList_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'goodCount_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else if(rows === 'replyCount_error') {
// 					res.json({
// 						"success" : 0,
// 						"work" : rows,
// 						"result" : null
// 					});
// 				} else {
// 					// 성공
// 					// json 객체 생성
// 					if(rows.length>0) {
// 						for(i=0; i<rows.length; i++) {
// 							result.push(articleJson(i, rows));
// 						}

// 						if(rows.length === 10) {
// 							var index = rows.length - 1;
// 							// 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
// 							day = rows[index].postTime;
// 							day = timeConverter(day);
// 							// 시간값 서버에 저장
// 							req.session.day = day;
// 						}
// 						// json 객체 응답
// 						res.json({
// 							"success" : 1,
// 							"work" : "myemotion",
// 							"result" : result
// 						});
// 					} else {
// 						// 마지막 페이지까지 보내어 더이상 값이 없는 경우
// 						// null 값을 반환하므로
// 						res.json({
// 							"success" : 1,
// 							"work" : "myemotion",
// 							"result" : null
// 						});
// 					}
// 				}
// 			});
// 		}
// 	}
// });