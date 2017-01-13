// exit.js

// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');
// var datas = [userId, loginTime];

// 마지막 로그인 날짜 입력
var updateLoginDate = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'UPDATE member SET last_login=? WHERE email=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					var error = 'updateLoginDate_error';
					conn.release();
					callback(err, error);
				} else {
					if(row.affectedRows == 1) {
						var result = true;
						conn.release();
						callback(null, result);
					}
				}
			});
		}
	});
}

// 현재시각 member 의 last_login 에 입력
exports.exit = function (datas, callback) {
	async.waterfall([
		function (callback) {
			updateLoginDate(datas, callback);
		}], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}