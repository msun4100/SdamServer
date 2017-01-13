// mycalendar.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async
var async = require('async');

// datas = [userId, month];

// 달력값 가져오기
exports.mycalendar = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			// DB 연결
			// 기분정보값 담을 배열 선언
			var emotionDatas = [];

			var sql = "SELECT DATE_FORMAT(reg_date, '%Y-%c-%e') AS date, emotion FROM calendar WHERE id=? AND (reg_date >= ? AND reg_date <= LAST_DAY(?)) ORDER BY reg_date ASC";
			conn.query(sql, [datas[0], datas[1], datas[1]], function (err, arr) {
				// console.log('datas : ', datas);
				if(err) {
					console.log('err : ', err);
					var error = 'mycalendar_error';
					conn.release();
					callback(error);
				} else {
					// 값이 있을때만 작업
					if(arr !== null) {
						for(i=0; i<arr.length; i++) {
							// '0000-00-00' 문자열의 8번째 인덱스부터 2자리를 잘라 dateArray에 저장
							// dateArray[2] 는 날짜의 일자값
							var temp = arr[i].date;
							var dateArray = temp.split('-');
							var date = {
								'date' : dateArray[2],
								'emotion' : arr[i].emotion
							}
							emotionDatas.push(date);
						}
					}
					conn.release();
					callback(emotionDatas);
				}
			});
		}
	});
};