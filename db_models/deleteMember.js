// DB 연결 파일 require
var pool = require('./mobile/dbConfig');

// 회원정보 삭제
exports.deleteMember = function (callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			var sql = 'DELETE FROM member WHERE del=1 AND DATEDIFF(CURRENT_DATE(), withdraw_date) >= 7';
			conn.query(sql, function (err, result) {
				if(err) {
					console.log('err : ', err);
					var error = 'deleteMember_error';
					conn.release();
					callback(error);
				} else {
					var result = true;
					conn.release();
					callback(result);
				}
			});
		}
	});
}