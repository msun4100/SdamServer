// emailauth.js

// 인증메일 발송
// 인증번호를 auth_num컬럼에 저장
var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 150,
	host: '127.0.0.1',
	user: 'root',	// root
	password: '1119',	// 1119
	database: 'ssdam'
});

exports.authCheck = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 접속 실패
			console.log('err : ', err);
			result = 'DB_connection_error';
			callback(result);
		} else {
			var userId = datas[0];
			var sql = 'SELECT auth_num FROM member WHERE id=?';
			conn.query(sql, userId, function (err, rows) {
				if(err) {
					// query 실패
					console.log('err : ', err);
					result = 'SELECT_query_error';
					callback(result);
				} else {
					var authNum = auth_num;
					// 인증번호 동일성 확인
					if(authNum == datas[1]) {
						result = true;
						conn.release();
						callback(result);
					} else {
						result = 'authNum_differ';
						conn.release();
						callback(result);
					}
				}
			});
		}
	});
};