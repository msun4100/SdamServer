// mycalendar.js

// reply.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/my/mycalendar');
// moment
var moment = require('moment')

router.get('/:dayValue', function (req, res) {
	var userId = req.session.userId;	// session에 저장된 값

	// 사용자가 보기를 원하는 달
	// '00000000' 형태, 해당 월의 1일로 보내준다.
	var dayValue = req.params.dayValue;

	// YYYY-MM-DD 형식으로 변환
	var year = dayValue.substr(0,4);
	var month = dayValue.substr(4,2)-1;	// 나오는 값은 인덱스, 1월은 인덱스0, 2월은 인덱스1
	var day = dayValue.substr(6,2);
	var temp = new Date(year, month, day);
	var date = moment(temp).format('YYYY-MM-DD');

	var datas = [userId, date];
	// console.log('datas : ', datas);

	if(dayValue === undefined) {
		res.json({
			"success" : 0,
			"work" : 'days_undefined',
			"result" : null
		});
	} else {
		db.mycalendar(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'mycalendar_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				// query 성공
				if(result.length == 0) {
					result = null;
				}

				res.json({
					"success" : 1,
					"work" : 'mycalendar',
					"result" : result
				});
			}
		});
	}
});

module.exports = router;