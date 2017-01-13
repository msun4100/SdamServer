// new.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async 모듈
var async = require('async');
// 시간 계산 함수
var timeGap = require('../../../function/timeGap');

var config = require('../../../config');

// 글목록 불러오기
var getList = function (datas, callback) {
	// console.log("config.display", config.display);
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// var sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, age, unlocate FROM board WHERE reg_date > DATE_ADD(now(), INTERVAL -3 MONTH) AND age BETWEEN ? AND ? AND prior=0 AND locked=0 AND notice='N' ORDER BY num DESC LIMIT 20";
			var sql = "SELECT num, writer, IFNULL(TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1), 99999) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE reg_date > DATE_ADD(now(), INTERVAL -3 MONTH) AND age BETWEEN ? AND ? AND prior=0 AND locked=0 AND notice='N' ORDER BY num DESC LIMIT ?";
			conn.query(sql, [ datas[0], datas[1], datas[0], datas[2], datas[3], config.display ], function (err, list) {
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
var getTotal = function (datas, reqDate, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = "SELECT COUNT(num) as total FROM all_view WHERE age BETWEEN ? AND ? AND prior=0 AND locked=0 AND reg_date < ? AND notice='N'";
			conn.query(sql, [ datas[2], datas[3], reqDate ], function (err, total) {
				if(err) {
					var error = 'getTotal_error';
					conn.release();
					callback(err, error);
				} else {
					
					console.log("total", total);
					conn.release();
					callback(null, total);
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
				conn.query(sql, [datas[4], number], function (err, count) {
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

// 한 달 이내
// 최신 글 목록 불러오기
exports.news = function (datas, callback) {
	async.waterfall([
		function (callback) {
			getList(datas, callback);
		}, function (datas, nums, list, callback) {
			myGoodCheck(datas, nums, list, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}