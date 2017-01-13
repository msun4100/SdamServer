// delarticle.js

var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../../../db_models/mobile/delete/delarticle');
var db2 = require('../../../db_models/mobile/delete/updateCalendar');
// 시간계산을 위한 moment
var moment = require('moment');

// 글삭제
/* id를 비교하여 글쓴이와 같은 경우에만 삭제 버튼이 나온다. */
router.post('/', function (req, res) {
	var num = req.body.num;	// 지우려는 글의 글번호
	var id = req.session.userId;	// session 에 저장된 값

	var datas = [num, id];

	if(num === undefined) {
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else {
		// 값이 넘어왔을시 작업
		db.delarticle(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkArticle_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteGood_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteReport_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteArticleBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteWriterBan_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteCalendar_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteRepGood_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteRepReport_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteTag_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteReply_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'deleteArticle_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'No_value') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				// 달력값 업데이트

				// result 값에서 삭제한 글의 등록시간 얻음
				var startTime = result
				// 삭제한 글 다음날 날짜 얻음
				var temp = moment(new Date(startTime)).add(1, 'd');
				var endTime = moment(new Date(temp)).format('YYYY-MM-DD');
				// 넘겨줄 정보값에 시작시간, 끝 시간 추가
				datas.push(startTime);
				datas.push(endTime);
				// 배열에서 글번호 값은 삭제
				datas.splice(0, 1);

				db2.updateCalendar(datas, function (result) {
					if(result === 'DB_connection_error') {
						res.json({
							"success" : 0,
							"work" : result,
							"result" : null
						});
					} else if(result === 'getEmotionData_error') {
						res.json({
							"success" : 0,
							"work" : result,
							"result" : null
						});
					} else if(result === 'insertCalendar_error') {
						res.json({
							"success" : 0,
							"work" : result,
							"result" : null
						});
					} else {
						// json 응답
						res.json({
							"success" : 1,
							"work" : "delete_article",
							"result" : "ok"
						});
					}
				});
			}
		});
	}
});

module.exports = router;