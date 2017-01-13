// myhide.js

// DB 연결 파일 require
var pool = require('../dbConfig');

exports.myhide = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			// DB 연결
			console.log('datas : ', datas);
			var sql = 'UPDATE board SET locked=? WHERE num=? AND writer=?';
			conn.query(sql, datas, function (err, rows) {
				if(err) {
					console.log('err : ', err);
					var error = 'myhide_error';
					conn.release();
					callback(error);
				} else {
					// query 성공
					if(rows.affectedRows === 1) {
						result = true;
						conn.release();
						callback(result);
					}
				}
			});
		}
	});
};