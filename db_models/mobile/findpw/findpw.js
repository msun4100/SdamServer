// findpw.js

// DB 연결 파일 require
var pool = require('../dbConfig');

// DB 비밀번호를 임시 비밀번호로 바꾸기만 한다.
exports.findpw = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			// DB 연결
			var sql = 'UPDATE member SET pw=? WHERE email=?';
			conn.query(sql, datas, function (err, result) {
				console.log('datas : ', datas);
				if(err) {
					console.log('err : ', err);
					var error = 'UPDATE_query_error';
					callback(error);
				} else if(result.affectedRows == 1) {
					var value = true;
					callback(value);
				} else {
					console.log("err : Can't find member data!");
					var error = 'No_value';
					callback(error);
				}
			});
		}
	});
}