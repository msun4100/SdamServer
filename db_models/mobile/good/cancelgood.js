// calcelgood.js

// DB 연결 파일 require
var pool = require('../dbConfig');

exports.cancelgood = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(error);
		} else {
			// DB connect
			var sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE num=? AND id=?';
			conn.query(sql, datas, function (err, result) {
				if(err) {
					// query error
					console.log('err : ', err);
					var error = 'cancelgood_SELECT_error';
					conn.release();
					callback(error);
				} else {
					// query 성공
					if(result[0].cnt > 0) {
						// 존재하는 경우
						sql = 'DELETE FROM goodwrite WHERE num=? AND id=?';
						conn.query(sql, datas, function (result) {
							if(err) {
								// query error
								console.log('err : ', err);
								var error = 'cancelgood_DELETE_error';
								conn.release();
								callback(error);
							} else {
								// query 성공
								result = true;
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