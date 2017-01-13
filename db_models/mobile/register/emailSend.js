// emailSend.js

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

exports.authStart = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 접속 실패
			console.log('err : ', err);
			result = 'DB_connection_error';
			callback(result);
		} else {
			var sql = 'UPDATE member SET auth_num=? WHERE id=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query 실패
					console.log('err : ', err);
					result = 'UPDATE_query_error';
					callback(result);
				} else {
					if(row.affectedRows === 1) {	// update, insert, delete 만 affectedRows 생성
						result = true;
						conn.release();
						callback(result);
					}
				}
			});
		}
	});
};