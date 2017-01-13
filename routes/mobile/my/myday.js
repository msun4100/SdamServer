// myday.js
var express = require('express');
var router = express.Router();
var moment = require('moment');

// DB 연결
var db = require('../../../db_models/mobile/my/myday');
// json 생성
var articleJson = require('../../../function/articleJson');
var timeConverter = require('../../../function/timeConverter')

// 해당 날짜에 내가 작성한 글
router.get('/:day', function (req, res) {
	var date = req.params.day;	// 원하는 날짜, 년월일, ex) 20150203
	var id = req.session.userId;	//session에 저장된 값
	var latitude = req.session.latitude;
	var logitude = req.session.logitude;

	var result = [];

	// YYYY-MM-DD hh:mm:ss 형식으로 변환, 00:00:00
	var year = date.substr(0,4);
	var month = date.substr(4,2)-1;	// 나오는 값은 인덱스, 1월은 인덱스0, 2월은 인덱스1
	var day = date.substr(6,2);
	date = new Date(year, month, day);
	var date2 = new Date(Date.parse(date) + 1*1000*60*60*24);	// date 보다 하루 지난 날짜
	date2 = new Date(date2.getTime() - 1*1000);	// date + 1일 에서 1초전 date 23:59:59

	// MySQL datetime 형태로 변환
	date = moment(date).format('YYYY-MM-DD HH:mm:ss');
	date2 = moment(date2).format('YYYY-MM-DD HH:mm:ss');


	// 전달할 data
	var datas = [latitude, logitude, id, date, date2];

	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else {
		// 값을 제대로 받은 경우
		db.myday(datas, function (rows) {
			if(rows === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else if(rows === 'getList_error') {
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else if(rows === 'myGoodCheck_error') {
				res.json({
					"success" : 0,
					"work" : rows,
					"result" : null
				});
			} else {
				// 성공
				// json 객체 생성
				if(rows.length > 0) {
					for(i=0; i<rows.length; i++) {
						var article = articleJson(i, rows);
						result.push(article);
					}

					// var index = rows.length - 1;
					// // 마지막 글이 현재 불러온 글 중 가장 오래된 글이므로 작성시간을 저장
					// day = rows[index].postTime;
					// day = timeConverter(day);

					// // 시간값 서버에 저장
					// req.session.yDay = timeConverter(row[0].postTime);
					// req.session.yDay2 = day;

					// json 객체 응답
					res.json({
						"success" : 1,
						"work" : "myday",
						"result" : result
					});
				} else {
					// 마지막 페이지까지 보내어 더이상 값이 없는 경우
					// null 값을 반환하므로
					res.json({
						"success" : 1,
						"work" : "myday",
						"result" : null
					});
				}	// else 2
			}	// else 1
		});
	}
});

module.exports = router;