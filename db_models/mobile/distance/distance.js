// distance.js


// DB 연결 파일 require
var pool = require('../dbConfig');

exports.distance = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 중 error 발생
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			// DB 연결 성공
			var sql = 'UPDATE member SET distance=? WHERE email=?';
			conn.query(sql, datas, function (err, rows) {
				if(err) {
					// query error
					console.log('err : ', err);
					var error = 'distance_error';
					conn.release();
					callback(error);
				} else {
					if(rows.affectedRows === 1) {	// UPDATE, DELETE, INSERT 시에만 affectedRows 생성됨
						result = true;
					}
					conn.release();
					callback(result);
				}
			});
		}
	});
};