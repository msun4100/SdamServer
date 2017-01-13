// login.js

// DB 연결 파일 require
var pool = require('../dbAdmin');
var async = require('async');
// 암호화를 위한 변수 bcrypt
var bcrypt = require('bcrypt');

// user 확인
var checkUser = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT COUNT(*) AS cnt, del, pw FROM member WHERE email=?';
			conn.query(sql, datas[0], function (err, rows) {
				if(err) {
					var error = 'checkUser_error';
					conn.release();
					callback(err, error);
				} else {
					if(rows[0].cnt == 1 && rows[0].del == 0) {
						// 비밀번호 확인
						bcrypt.compare(datas[1], rows[0].pw, function(err, res) {
							if(res == true) {
								conn.release();
								callback(null, datas);
							} else {
								var error = 'pw_unmatch';
								conn.release();
								callback(error, error);
							}
						});
					} else if(rows[0].cnt == 0) {
						// 없는 유저의 경우
						var error = 'No_value';
						conn.release();
						callback(error, error);
					} else if(row[0].del == 1) {
						// 최근 탈퇴한 경우
						var error = 'Recently_withdraw';
						conn.release();
						callback(error, error);
					}
				}
			});
		}
	});
}

// login
var loginUser = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT email, birth FROM member WHERE email=?';
			conn.query(sql, datas, function (err, result) {
				if(err) {
					var error = 'loginUser_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, result);
				}
			});
		}
	});
}

// 로그인
exports.login = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkUser(datas, callback);
		}, function (datas, callback) {
			loginUser(datas, callback);
		}
	],function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
};