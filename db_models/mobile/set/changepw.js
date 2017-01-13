// changepw.js

// DB 연결 파일 require
var pool = require('../dbConfig');

// 비밀번호 변경
exports.changepw = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			// DB 연결
			var sql = 'UPDATE member SET pw=? WHERE email=?';
			conn.query(sql, datas, function (err, rows) {
				if(err) {
					console.log('err : ', err);
					var error = 'UPDATE_query_error';
					callback(error);
				} else if(rows.affectedRows === 1) {
					// query OK
					var result = true
					callback(result);
				} else {
					console.log("err : Can't find member data!");
					var error = "No_value";
					callback(error);
				}
			});
		}
	});
}