// wArticle.js

// DB 연결 파일 require
var pool = require('../dbAdmin');

exports.wArticle = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'INSERT INTO board (writer, age, emotion, category, image, content, reg_date) VALUES(?, ?, ?, ?, ?, ?, now())';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query error
					var error = 'writeArticle_error';
					conn.release();
					callback(err, error);
				} else {
					// query 성공
					if(row.affectedRows == 1) {
						var result = true;
						conn.release();
						callback(result);
					}
				}
			});
		}
	});
}