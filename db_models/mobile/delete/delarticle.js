// delarticle.js

// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');
var moment = require('moment');

// 글을 지우는 것은 글쓴이만 가능
// num, id

// 글이 존재하는지 확인
// 동시에 달력값 업데이트 위한 해당 글의 날짜값도 얻는다.
var checkArticle = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = "SELECT COUNT(*) AS cnt, DATE_FORMAT(reg_date, '%Y-%c-%e') AS date FROM board WHERE num=? AND writer=?";
			conn.query(sql, datas, function (err, count) {
				if(err) {
					// query error
					var error = 'checkArticle_error';
					conn.release();
					callback(err, error);
				} else {
					if(count[0].cnt == 1) {
						var dateInfo = count[0].date;
						conn.release();
						callback(null, datas, dateInfo);
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

// 글에 대한 좋아요 삭제
var deleteGood = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM goodwrite WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteGood_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 글에 대한 신고 삭제
var deleteReport = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM report WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteReport_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 글에 대한 차단 삭제
var deleteArticleBan = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM article_ban WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteArticleBan_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 작성자 차단 삭제
var deleteWriterBan = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM writer_ban WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteWriterBan_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 달력에 글정보 삭제
var deleteCalendar = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'DELETE FROM calendar WHERE num=? AND id=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					var error = 'deleteCalendar_error';
					conn.release();
					callback(err, error);
				} else {
					conn. release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 댓글에 대한 좋아요 삭제
var deleteRepGood = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			// num 값을 주면 해당 num 값을 가진 댓글 좋아요가 모두 삭제
			var sql = 'DELETE FROM goodreply WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteRepGood_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 댓글에 대한 신고 삭제
var deleteRepReport = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM replyreport WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteRepReport_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 댓글에 대한 태그 삭제
var deleteTag = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM tag WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteTag_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 댓글 삭제
var deleteReply = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM reply WHERE num=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteReply_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, dateInfo);
				}
			});
		}
	});
}

// 글 삭제
var deleteArticle = function (datas, dateInfo, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM board WHERE num=? AND writer=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query error
					var error = 'deleteArticle_error';
					conn.release();
					callback(err, error);
				} else {
					var result = dateInfo;
					conn.release();
					callback(null, result);
				}
			});
		}
	});
}

// 글을 참조하는 항목을 모두 삭제하고
// 마지막으로 글 자체를 삭제한다.
exports.delarticle = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkArticle(datas, callback);
		}, function (datas, dateInfo, callback) {
			deleteGood(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteReport(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteArticleBan(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteWriterBan(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteCalendar(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteRepGood(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteRepReport(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteTag(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteReply(datas, dateInfo, callback);
		}, function (datas, dateInfo, callback) {
			deleteArticle(datas, dateInfo, callback);
		}], function (err, result) {
			if(err) console.log('err : ', err);
			callback(result);
		}
	);
}