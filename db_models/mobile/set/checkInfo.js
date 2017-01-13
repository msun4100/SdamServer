// checkInfo.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// 비밀번호 암호화 객체
var bcrypt = require('bcrypt');

// 회원정보 확인
exports.checkInfo = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			// DB 연결
			var sql = 'SELECT COUNT(*) AS cnt, pw FROM member WHERE email=?';
			conn.query(sql, datas[0], function (err, result) {
				if(err) {
					console.log('err : ', err);
					var error = 'SELECT_COUNT_error';
					conn.release();
					callback(error);
				} else if(result[0].cnt === 1) {
					// query OK
					bcrypt.compare(datas[1], result[0].pw, function (err, res) {
						if(err) {
							console.log('err : ', err);
							var error = 'pw_unmatch';
							conn.release();
							callback(error);
						} else if(res == true) {
							var result = true;
							callback(result);
						}
					});
				}
			});
		}
	});
}