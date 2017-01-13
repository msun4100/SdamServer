// delreply.js

// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');

// 댓글이 존재하는지 확인
var checkReply = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'SELECT COUNT(*) AS cnt FROM reply WHERE num=? AND reply_num=? AND reply_writer=?';
			conn.query(sql, datas, function (err, count) {
				if(err) {
					// query error
					var error = 'checkReply_error';
					conn.release();
					callback(err, error);
				} else {
					if(count[0].cnt === 1) {
						conn.release();
						callback(null, datas);
					} else {
						var error = 'No_value';
						conn.release();
						callback(error, error);
					}
				}
			});
		}
	});
}

// 댓글에 대한 좋아요 삭제
var deleteGood = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM goodreply WHERE num=? AND reply_num=? AND reply_writer=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query error
					var error = 'deleteGood_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

// 댓글에 대한 신고 삭제
deleteReport = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM replyreport WHERE num=? AND reply_num=? AND reply_writer=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query error
					var error = 'deleteReport_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

// 댓글에 대한 태그 삭제
deleteTag = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM tag WHERE num=? AND reply_num=?';
			conn.query(sql, [datas[0], datas[1]], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteTag_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

// 댓글 삭제
var deleteReply = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM reply WHERE num=? AND reply_num=? AND reply_writer=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query error
					var error = 'deleteReply_error';
					conn.release();
					callback(err, error);
				} else {
					var result = true;
					conn.release();
					callback(null, result);
				}
			});
		}
	});
}

// 댓글을 참조하는 항목을 모두 삭제하고
// 마지막으로 댓글 자체를 삭제한다.
exports.delreply = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkReply(datas, callback);
		}, function (datas, callback) {
			deleteGood(datas, callback);
		}, function (datas, callback) {
			deleteReport(datas, callback);
		}, function (datas, callback) {
			deleteTag(datas, callback);
		}, function (datas, callback) {
			deleteReply(datas, callback);
		}], function (err, result) {
			if(err) console.log('err : ', err);
			callback(result);
		}
	);
}