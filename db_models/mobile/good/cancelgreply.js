// cancelgreply.js

// DB 연결 파일 require
var pool = require('../dbConfig');

exports.cancelgreply = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			result = 'DB_connection_error';
			callback(result);
		} else {
			// DB connect
			var sql = 'SELECT COUNT(*) AS cnt FROM goodreply WHERE id=? AND num=? AND reply_num=?';
			conn.query(sql, datas, function (err, result) {
				if(err) {
					// query error
					console.log('err : ', err);
					var error = 'cancelgreply_SELECT_error';
					conn.release();
					callback(error);
				} else {
					// query 성공
					if(result[0].cnt > 0) {
						// 존재하는 경우
						sql = 'DELETE FROM goodreply WHERE id=? AND num=? AND reply_num=?';
						conn.query(sql, datas, function (result) {
							if(err) {
								// query error
								console.log('err : ', err);
								var error = 'cancelgreply_DELETE_error';
								conn.release();
								callback(error);
							} else {
								// query 성공
								var result = true;
								conn.release();
								callback(result);
							}
						});
					} else {
						var error = 'NO_value';
						conn.release();
						callback(error);
					}
				}
			});
		}
	});
};