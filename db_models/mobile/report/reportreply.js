// reportreply.js

// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');

var insertBan = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			var sql = 'INSERT INTO replyreport(num, writer, reply_num, category, reply_writer, report_date) VALUES(?, ?, ?, ?, ?, now())';
			conn.query(sql, datas, function (err, result) {
				if(err) {
					var error = 'reportreply_insertBan_error';
					conn.release();
					callback(err, error);
				} else if(result.affectedRows === 1) {
					// INSERT 성공시
					conn.release();
					callback(null, datas);
				}
			});
		}
	});
};

var countBan = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var erro = 'DB_connection_error';
			callback(error);
		} else {
			// DB연결
			var sql = 'SELECT COUNT(*) AS cnt FROM replyreport WHERE reply_writer=? AND report_date > DATE_ADD(NOW(), INTERVAL -3 MONTH)';
			conn.query(sql, datas[4], function (err, count) {
				if(err) {
					var error ='reportreply_countBan_error';
					conn.release();
					callback(err, error);
				} else {
					// DB 연결
					// COUNT 값 가져와 반환
					var countData = count[0].cnt;
					conn.release();
					callback(null, datas, countData)
				}
			});
		}
	});
}

var userBan = function (datas, countData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB연결
			if(countData >= 5) {
				// 밴 횟수 5회 이상
				var sql = 'UPDATE member SET ban=1 WHERE email=?';
				conn.query(sql, datas[4], function (err, result) {
					if(err) {
						var error ='reportreply_userBan_error';
						conn.release();
						callback(error);
					} else if(result.affectedRows === 1) {
						// DB 연결
						// 밴 당한 경우 banCount값 1로 반환
						var banCount = 1;
						conn.release();
						callback(null, banCount);
					}
				});
			} else {
				// 밴 당하지 않은 경우 banCount값 0으로반환
				var banCount = 0;
				conn.release();
				callback(null, banCount);
			}
		}
	});
}

// 댓글 신고
exports.reportreply = function (datas, callback) {
	async.waterfall([
		function (callback) {
			insertBan(datas, callback);
		}, function (datas, callback) {
			countBan(datas, callback);
		}, function (datas, countData, callback) {
			userBan(datas, countData, callback)
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}