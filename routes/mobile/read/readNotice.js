// read.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/read/read');
// articleJson
var articleJson = require('../../../function/articleJson');
// bestReply
var bestReplyJson = require('../../../function/bestReplyJson');
// repliesJson
var repliesJson = require('../../../function/repliesJson');

/* 글 하나 읽기 */
router.get('/:num', function (req, res) {	// /read/:num 에서 :num은 변하는 값
	var num = req.params.num;	// 글번호값, url 에서 얻음
	var id = req.session.userId;	// session에 저장된 값
	var latitude = req.session.latitude;	// session에 저장된 값
	var logitude = req.session.logitude;	// session에 저장된 값

	if(num == -1) {
		// parameter 제대로 못받은 경우
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else {
		// DB 값 가져오기
		var datas = [num, latitude, logitude, id];

		db.read(datas, function (result) {
			if(result === 'DB_connection_error') {
				// DB 연결 error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'clickNum_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === ' readArticle_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'articleGoodNum_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'readReplies_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'repliesMyGood_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'repliesGoodNum_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'readTag_error') {
				// query error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				// 성공

				// result 데이타 확인

				var writer = result[0].writer;
				var i;
				var article = articleJson(0, result);
				var bestReply = bestReplyJson(1, id, result, 2, writer);
				var replies = repliesJson(i, id, result, writer);
				// console.log('article : ', article);
				// console.log('bestReply : ', bestReply);
				// console.log('replies : ', replies);

				// console.log('result : ', result);

				// json 응답
				res.json({
					"success" : 1,
					"work" : "read",
					"result" : {
						"article" : article,
						"bestReply" : bestReply,
						"replies" : replies
					}
				});
			}
		});
	}
});

module.exports = router;