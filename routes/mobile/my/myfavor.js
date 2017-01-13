// myfavor.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/my/myfavor');
var db2 = require('../../../db_models/mobile/my/myfavor2');

// json 생성
var articleJson = require('../../../function/articleJson');
// 시간 변환
var timeConverter = require('../../../function/timeConverter');

// 내가 공감 및 댓글 단 글
router.get('/:num', function (req, res) {
	var id = req.session.userId;		// session에 저장된값
	var page = req.params.num;	// page 값
	var latitude = req.session.latitude;	// session에 저장된 값
	var logitude = req.session.logitude;	// session에 저장된 값
	/* id를 이용하여 DB에서 query */

	var result = [];
	var datas = [latitude, logitude, id];
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
		if(page == 1) {
			// 처음 요청인 경우
			db.myfavor (datas, function (resultData) {
				if(resultData === 'getNumList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'goodList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'getList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else {
					// 값이 있는 경우
					if(resultData.length > 0) {
						for(i=0; i<resultData.length; i++) {
							result.push(articleJson(i, resultData));
						}

						index = resultData.length-1;
						// 서버에 글번호 값 저장
						req.session.num = result[index].num;
						req.session.num2 = req.session.num;

						req.session.fPage = page;

						res.json({
							"success" : 1,
							"work" : "myfavor",
							"result" : result
						});
					} else {
						// 값이 없는 경우
						res.json({
							"success" : 1,
							"work" : "myfavor",
							"result" : null
						});
					}
				}
			});
		} else if(page != req.session.fPage) {
			// 처음 요청 이 후
			num = req.session.num
			// 글번호 값 전달
			datas.push(num);
			console.log('datas : ', datas);
			db2.myfavor2 (datas, function (resultData) {
				if(resultData === 'repList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'goodList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'getList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'goodCount_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'replyCount_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else {
					if(resultData.length !== 0) {
						// 값이 존재하는 경우
						for(i=0; i<resultData.length; i++) {
							result.push(articleJson(i, resultData));
						}

						index = resultData.length-1;
						// 서버에 글번호 값 저장
						req.session.num2 = result[index].num;

						req.session.fPage = page;

						res.json({
							"success" : 1,
							"work" : "myfavor",
							"result" : result
						});
					} else {
						// 더이상 값이 없는 경우
						res.json({
							"success" : 1,
							"work" : "myfavor",
							"result" : null
						});
					}
				}
			});
		} else if(page == req.session.fPage) {
			// 처음 요청 이 후
			num = req.session.num;
			// 시간값 전달
			datas.push(num);
			db2.myfavor2 (datas, function (resultData) {
				if(resultData === 'repList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'goodList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'getList_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'goodCount_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else if(resultData === 'replyCount_error') {
					res.json({
						"success" : 0,
						"work" : resultData,
						"result" : null
					});
				} else {
					if(resultData.length !== 0) {
						// 값이 존재하는 경우
						for(i=0; i<resultData.length; i++) {
							result.push(articleJson(i, resultData));
						}

						res.json({
							"success" : 1,
							"work" : "myfavor",
							"result" : result
						});
					} else {
						// 더이상 값이 없는 경우
						res.json({
							"success" : 1,
							"work" : "myfavor",
							"result" : null
						});
					}
				}
			});
		}
	}
});

module.exports = router;