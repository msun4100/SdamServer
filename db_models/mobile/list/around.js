// around.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async 모듈
var async = require('async');
// 시간 계산 함수
var timeGap = require('../../../function/timeGap');

// 거리 피드범위 200 미만인 경우
// 글목록 불러오기
var getList = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// var sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, age, unlocate FROM board WHERE reg_date > DATE_ADD(now(), INTERVAL -3 MONTH) AND age BETWEEN ? AND ? AND prior=0 AND locked=0 AND notice='N' HAVING distance < ? ORDER BY RAND() DESC LIMIT 20";
			var sql = "SELECT num, writer, IFNULL(TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1), 99999) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE reg_date > DATE_ADD(now(), INTERVAL -3 MONTH) AND age BETWEEN ? AND ? AND prior=0 AND locked=0 AND notice='N' HAVING distance < ? OR distance = 99999 ORDER BY RAND() DESC LIMIT 20"
			// 거리값이 없는 경우 99999 값을 넣고 해당 값도 가져오도록 한다.
			conn.query(sql, [ datas[0], datas[1], datas[0], datas[2], datas[3], datas[4] ], function (err, list) {
				if(err) {
					var error = 'getList_error';
					conn.release();
					callback(err, error);
				} else {
					// query 성공
					var nums = [];
					for(i=0; i<list.length; i++) {
						nums.push(list[i].num);
					}
					conn.release();
					callback(null, datas, nums, list);
				}
			});
		}
	});
}

// 거리 피드 범위 200 인경우
// 글목록 불러오기
var getList2 = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// var sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, age, prior FROM board WHERE reg_date > DATE_ADD(NOW(), INTERVAL -3 MONTH) AND age BETWEEN ? AND ? AND prior=0 AND locked=0 AND notice='N' ORDER BY RAND() DESC LIMIT 20";
			var sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, age, locked, good_count, reply_count FROM all_view WHERE reg_date > DATE_ADD(NOW(), INTERVAL -3 MONTH) AND age BETWEEN ? AND ? AND prior=0 AND locked=0 AND notice='N' ORDER BY RAND() DESC LIMIT 20"
			conn.query(sql, [ datas[0], datas[1], datas[0], datas[2], datas[3] ], function (err, list) {
				if(err) {
					var error = 'getList_error';
					conn.release();
					callback(err, error);
				} else {
					// query 성공
					var nums = [];
					for(i=0; i<list.length; i++) {
						nums.push(list[i].num);
					}
					conn.release();
					callback(null, datas, nums, list);
				}
			});
		}
	});
}

// // 좋아요 갯수 추가
// var goodCount = function (datas, nums, list, callback) {
// 	pool.getConnection(function (err, conn) {
// 		if(err) {
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			var i = 0;
// 			var sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE num=?';
// 			async.each(nums, function (number, callback) {
// 				conn.query(sql, number, function (err, count) {
// 					if(err) {
// 						var error = 'goodCount_error';
// 					} else {
// 						// 좋아요 갯수 추가
// 						list[i].good_num = count[0].cnt;
// 						// 시간 계산추가
// 						timeGap(i, list);
// 						i++;
// 					}
// 					callback();
// 				});
// 			}, function (err, error) {
// 				if(err) {
// 					conn.release();
// 					callback(err, error);
// 				} else {
// 					conn.release();
// 					callback(null, datas, nums, list);
// 				}
// 			});
// 		}
// 	});
// }

// // 댓글 갯수 추가
// var replyCount = function (datas, nums, list, callback) {
// 	pool.getConnection(function (err, conn) {
// 		if(err) {
// 			var error ='DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			var i = 0;
// 			var sql = 'SELECT COUNT(*) AS cnt FROM reply WHERE num=?';
// 			async.each(nums, function (number, callback) {
// 				conn.query(sql, number, function (err, count) {
// 					if(err) {
// 						var error = 'replyCount_error';
// 					} else {
// 						// 댓글 갯수 추가
// 						list[i].reply_count = count[0].cnt;
// 						i++;
// 					}
// 					callback();
// 				});
// 			}, function (err, error) {
// 				if(err) {
// 					conn.release();
// 					callback(err, error);
// 				} else {
// 					conn.release();
// 					callback(null, datas, nums, list);
// 				}
// 			});
// 		}
// 	});
// }

// 내가 좋아요 한 글인지 확인
var myGoodCheck = function (datas, nums, list, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var i = 0;
			var sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE id=? AND num=?';
			async.each(nums, function (number, callback) {
				conn.query(sql, [datas[5], number], function (err, count) {
					if(err) {
						var error = 'myGoodCheck_error';
 					} else {
 						// myGood
						list[i].myGood = count[0].cnt;
						// 시간 계산추가
						timeGap(i, list);
 						i++;
 					}
 					callback();
				});
			}, function (err, error) {
				if(err) {
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, list);
				}
			});
		}
	});
}

// 지정한 거리내의 글 불러오기
exports.around = function (datas, callback) {
	async.waterfall([
		function (callback) {
			if(datas[4] == 200) {
				getList2(datas, callback);
			} else {
				getList(datas, callback);
			}
		}, function (datas, nums, list, callback) {
			myGoodCheck(datas, nums, list, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}