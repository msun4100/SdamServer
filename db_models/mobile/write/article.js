// article.js

// DB 연결 파일 require
var pool = require('../dbConfig');
var async = require('async');

// 사용자가 차단유저인지 확인
var checkBan = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error)
		} else {
			var sql = 'SELECT ban FROM member WHERE email=?';
			conn.query(sql, datas[0], function (err, result) {
				if(err) {
					var error = 'checkBan_error';
					conn.release();
					callback(err, error);
				} else {
					// 결과의 ban 값을 가져온다
					var temp = result[0].ban;
					// string 이므로 int 로 형변환
					var ban = parseInt(temp, 10);
					conn.release();
					callback(null, datas, ban);
				}
			});
		}
	});
}

// 글쓰기
var writeArticle = function (datas, ban, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql;
			if(ban == 0) {
				// 일반 사용자의 경우
				sql = 'INSERT INTO board (writer, latitude, logitude, age, emotion, content, unlocate, locked, category, image, reg_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())';
			} else {
				// 서버에서 차단 당한 경우
				sql = 'INSERT INTO board (writer, latitude, logitude, age, emotion, content, unlocate, locked, category, image, reg_date, prior) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), 1)';
			}
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query error
					var error = 'writeArticle_error';
					conn.release();
					callback(err, error);
				} else {
					// query 성공
					if(row.affectedRows == 1) {
						// INSERT 된 글번호값을 받아온다, row의 insertId 값이 기본키값
						var articleNum = parseInt(row.insertId, 10);
						conn.release();
						callback(null, datas, articleNum);
					}
				}
			});
		}
	});
}

// 나의 달력 등록정보 확인
// select count(*) 값이 1이면 기존값 update 아니면 insert
var checkCalendar = function (datas, articleNum, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// 현재 글을 쓰는 날의 0시 부터 현재까지 데이터가 있는지 확인
			var sql = "SELECT COUNT(*) AS cnt FROM calendar WHERE id=? AND reg_date >= CURDATE()";
			conn.query(sql, datas[0], function (err, count) {
				if(err) {
					var error = 'checkCalendar_error';
					conn.release();
					callback(err, error);
				} else {
					var temp = count[0].cnt;
					// 변수 cnt에 count 값 저장
					var cnt = parseInt(temp, 10);
					conn.release();
					callback(null, datas, cnt, articleNum);
				}
			});
		}
	});
}

// 나의 달력 갱신
var updateCalendar = function (datas, cnt, articleNum, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql;
			if(cnt == 0) {
				// 이전에 등록한 값이 없는 경우
				sql = 'INSERT INTO calendar(num, id, emotion, reg_date) VALUES(?, ?, ?, now())';
				conn.query(sql, [articleNum, datas[0], datas[4]], function (err, row) {
					if(err) {
						var error = 'updateCalendar_error';
						conn.release();
						callback(err, error);
					} else {
						if(row.affectedRows == 1) {
							var result = true
							conn.release();
							callback(null, result);
						}
					}
				});
			} else {
				// 이전에 등록한 값이 있는 경우
				sql = 'UPDATE calendar SET num=?, emotion=? WHERE id=? AND reg_date >= CURDATE()';
				conn.query(sql, [articleNum, datas[4], datas[0]], function (err, row) {
					if(err) {
						var error = 'updateCalendar_error';
						conn.release();
						callback(err, error);
					} else {
						if(row.affectedRows == 1) {
							var result = true
							conn.release();
							callback(null, result);
						}
					}
				});
			}
		}
	});
}

exports.article = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkBan(datas, callback);
		}, function (datas, ban, callback) {
			writeArticle(datas, ban, callback);
		}, function (datas, articleNum, callback) {
			checkCalendar(datas, articleNum, callback);
		}, function (datas, cnt, articleNum, callback) {
			updateCalendar(datas, cnt, articleNum, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}