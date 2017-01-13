// withdraw.js
var bcrypt = require('bcrypt');
// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');

// 회원정보가 존재하는지 확인
var checkMember = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			console.log('err : ', err);
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			var sql = 'SELECT COUNT(*) AS cnt, pw FROM member WHERE email=?';
			conn.query(sql, datas, function (err, row) {
				if(err) {
					console.log('err : ', err);
					var error = 'SELECT_COUNT_error';
					conn.release();
					callback(err, error);
				} else {
					if(row[0].cnt == 1) {
						// 비밀번호 확인
						bcrypt.compare(datas[1], row[0].pw, function(err, res) {
							if(res == true) {
								conn.release();
								callback(null, datas);
							} else {
								var error = 'pw_unmatch';
								conn.release();
								callback(error, error);
							}
						});
					} else {
						var error = 'No_value';
						conn.release();
						callback(err, error);
					}
				}
			});
		}
	});
}

// 해당 회원이 쓴 글 확인
var checkArticle = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT num FROM board WHERE writer=?';
			conn.query(sql, datas[0], function (nums) {
				if(err) {
					var error = 'checkArticle_error';
					coon.release();
					callback(err, error);
				} else {
					var numList = [];
					if(nums != null) {
						for(i=0; i<nums.length; i++) {
							numList.push(nums[i].num);
						}
					}
					conn.release();
					callback(null, datas, numList);
				}
			});
		}
	});
}

// 글에 대한 좋아요 삭제
var deleteGood = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM goodwrite WHERE writer=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteGood_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, numList);
				}
			});
		}
	});
}

// 글에 대한 신고 삭제
var deleteReport = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM report WHERE writer=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteReport_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, numList);
				}
			});
		}
	});
}

// 글에 대한 차단 삭제
var deleteArticleBan = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM article_ban WHERE writer=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteArticleBan_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, numList);
				}
			});
		}
	});
}

// 작성자 차단 삭제
var deleteWriterBan = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM writer_ban WHERE writer=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteWriterBan_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, numList);
				}
			});
		}
	});
}

// 달력에 글정보 삭제
var deleteCalendar = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'DELETE FROM calendar WHERE id=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteCalendar_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, numList);
				}
			});
		}
	});
}

// 댓글에 대한 좋아요 삭제
var deleteRepGood = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			// num 값을 주면 해당 num 값을 가진 댓글 좋아요가 모두 삭제
			async.each(numList, function (num, callback) {
				var sql = 'DELETE FROM goodreply WHERE num=?';
				conn.query(sql, num, function (err, row) {
					if(err) {
						// query error
						var error = 'deleteRepGood_error';
						conn.release();
						callback(err, error);
					} else {
					}
					callback();
				});
			}, function (err, error) {
				conn.release();
				if(err) callback(err, error);
				callback(null, datas, numList);
			});
		}
	});
}

// 댓글에 대한 신고 삭제
var deleteRepReport = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			async.each(numList, function (num, callback) {
				var sql = 'DELETE FROM replyreport WHERE num=?';
				conn.query(sql, num, function (err, row) {
					if(err) {
						// query error
						var error = 'deleteRepReport_error';
						conn.release();
						callback(err, error);
					} else {
					}
					callback();
				});
			}, function (err, error) {
				conn.release();
				if(err) callback(err, error);
				callback(null, datas, numList);
			});
		}
	});
}

// 댓글에 대한 태그 삭제
var deleteTag = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			async.each(numList, function (num, callback) {
				var sql = 'DELETE FROM tag WHERE num=?';
				conn.query(sql, num, function (err, row) {
					if(err) {
						// query error
						var error = 'deleteTag_error';
						conn.release();
						callback(err, error);
					} else {
					}
					callback();
				});
			}, function (err, error) {
				conn.release();
				if(err) callback(err, error);
				callback(null, datas, numList);
			});
		}
	});
}

// 댓글 삭제
var deleteReply = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			async.each(numList, function (num, callback) {
				var sql = 'DELETE FROM reply WHERE num=?';
				conn.query(sql, num, function (err, row) {
					if(err) {
						// query error
						var error = 'deleteReply_error';
						conn.release();
						callback(err, error);
					} else {
					}
					callback();
				});
			}, function (err, error) {
				conn.release();
				if(err) callback(err, error);
				callback(null, datas, numList);
			});
		}
	});
}

// 글 삭제
var deleteArticle = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB connected
			var sql = 'DELETE FROM board WHERE writer=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					// query error
					var error = 'deleteArticle_error';
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

// 회원정보 삭제
// 회원정보의 del 값을 1로 변경
var deleteMember = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'UPDATE member SET del=1, withdraw_date=CURRENT_DATE() WHERE email=?';
			conn.query(sql, datas[0], function (err, row) {
				if(err) {
					var error = 'deleteMember_error';
					conn.release();
					callback(err, error);
				} else {
					if(row.affectedRows == 1) {
						var result = true;
						conn.release();
						callback(null, result);
					}
				}
			});
		}
	});
}

exports.withdraw = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkMember(datas, callback);
		}, function (datas, callback) {
			checkArticle(datas, callback);
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteGood(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteReport(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteArticleBan(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteWriterBan(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteCalendar(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteRepGood(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteRepReport(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteTag(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteReply(datas, numList, callback);
			} else {
				callback(datas, numList, callback);
			}
		}, function (datas, numList, callback) {
			if(numList != null) {
				deleteArticle(datas, numList, callback);
			} else {
				callback(datas, callback);
			}
		},  function (datas, callback) {
			deleteMember(datas, callback);
		}], function (err, result) {
			if(err) console.log('err : ', err);
			callback(result);
		}
	);
}