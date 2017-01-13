// updateCalendar.js

// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');

// 달력 글정보 확인
var getEmotionData = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT num, emotion FROM board WHERE writer=? AND reg_date BETWEEN ? AND ? ORDER BY num DESC LIMIT 1';
			conn.query(sql, datas, function (err, data) {
				if(err) {
					var error = 'getEmotionData_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, data, datas);
				}
			});
		}
	});
}

var insertCalendar = function (data, datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			if(data.length !== 0) {
				var emotion = data[0].emotion;
				var num = data[0].num;
				var sql = 'INSERT INTO calendar(emotion, num, id, reg_date) VALUE(?, ?, ?, ?)';
				conn.query(sql, [emotion, num, datas[0], datas[1]], function (err, rows) {
					if(err) {
						var error = 'insertCalendar_error';
						conn.release();
						callback(err, error);
					} else if(rows.affectedRows == 1) {
						var result = true;
						conn.release();
						callback(null, result);
					}
				});
			} else {
				var result = 0;
				conn.release();
				callback(null, result);
			}
		}
	});
}

exports.updateCalendar = function (datas, callback) {
	async.waterfall([
		function (callback) {
			getEmotionData(datas, callback);
		}, function (data, datas, callback) {
			insertCalendar(data, datas, callback);
		}], function (err, result) {
			if(err) console.log('err : ', err);
			callback(result);
		}
	);
}