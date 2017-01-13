// goodreply.js

// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');

// 좋아요 등록
var insertGoodReply = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'INSERT INTO goodreply (id, num, reply_num, reply_writer, reg_date) VALUES(?, ?, ?, ?, now())';
			conn.query(sql, datas, function (err, rows) {
				if(err) {
					var error = 'insertGoodReply_error';
					conn.release();
					callback(err, error);
				} else {
					if(rows.affectedRows == 1) {
						conn.release();
						callback(null, datas);
					}
				}
			});
		}
	});
}

// 푸시 아이디
var getPushId = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT push_id FROM member WHERE email=? AND del=0';
			conn.query(sql, datas[3], function (err, result) {
				if(err) {
					var error = 'getPushId_error';
					conn.release();
					callback(err, error);
				} else {
					if(result === undefined) {
						var error = 'No_value';
						conn.release();
						callback(error, error);
					} else if(result === null) {
						var error = 'No_value';
						conn.release();
						callback(error, error);
					} else {
						conn.release();
						callback(null, result);
					}
				}
			});
		}
	});
}

exports.goodreply = function (datas, callback) {
	async.waterfall([
		function (callback) {
			insertGoodReply(datas, callback);
		}, function (datas, callback) {
			getPushId(datas, callback)
		}], function (err, result) {
			if(err) console.log('err : ', err);
			callback(result);
		}
	);
};