// contentSearch2.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async 모듈
var async = require('async');
// 시간 계산 함수
var timeGap = require('../../../function/timeGap');

var config = require('../../../config');

// 글목록 가져오기
var getList = function (datas, callback) {
	pool.getConnection(function (err ,conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			// var sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE reg_date < ? AND age BETWEEN ? AND ? AND content LIKE '%?%' AND prior=0 AND locked=0 HAVING distance <= ? ORDER BY num DESC LIMIT 20";
			// console.log("datas2", datas);
			// datas2 [ '37.83783783783784','126.80485479040853', '%테%',
  			// 		'tests6@', '2017-01-03 19:20:01' ]

			var sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE reg_date < ? AND content LIKE ? AND prior=0 AND locked=0 ORDER BY num DESC LIMIT ?";
			conn.query(sql, [datas[0], datas[1], datas[0], datas[4], datas[2], config.display], function (err, list) {
				if(err) {
					var error = 'getList_error';
					conn.release();
					callback(err, error);
				} else {
					// 글번호 배열
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

// // 글목록 가져오기, 거리피드범위 200
// var getList2 = function (datas, callback) {
// 	pool.getConnection(function (err ,conn) {
// 		if(err) {
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			// DB 연결
// 			var sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE reg_date < ? AND age BETWEEN ? AND ? AND content LIKE %?% AND prior=0 AND locked=0 ORDER BY num DESC LIMIT 20";
// 			conn.query(sql, [datas[0], datas[1], data[0], datas[7], datas[2], datas[3], datas[4]] , function (err, list) {
// 				if(err) {
// 					var error = 'getList_error';
// 					conn.release();
// 					callback(err, error);
// 				} else {
// 					// 글번호 배열
// 					var nums = [];
// 					for(i=0; i<list.length; i++) {
// 						nums.push(list[i].num);
// 					}
// 					conn.release();
// 					callback(null, datas, nums, list);
// 				}
// 			});
// 		}
// 	});
// }

// // 좋아요 갯수 추가, 시간값 계산
// var goodCount = function (datas, nums, list, callback) {
// 	pool.getConnection(function (err, conn) {
// 		if(err) {
// 			console.log('err: ', err);
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			// DB 연결
// 			var i = 0;
// 			var sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE num=?';
// 			async.each(nums, function (number, callback) {
// 				conn.query(sql, number, function (err, count) {
// 					if(err) {
// 						var error = 'goodCount_error';
// 						callback(err, error);
// 					} else {
// 						// 글 값에 좋아요 갯수 추가
// 						timeGap(i, list);
// 						list[i].good_num = count[0].cnt;
// 						i++;
// 					}
// 					callback();
// 				});
// 			}, function (err, error) {
// 				if(err) {
// 					conn.release();
// 					callback(err);
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
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			// DB 연결
// 			var i = 0;
// 			var sql = 'SELECT COUNT(*) AS cnt FROM reply WHERE num=?';
// 			async.each(nums, function (number, callback) {
// 				conn.query(sql, number, function (err, count) {
// 					if(err) {
// 						var error = 'replyCount_error';
// 						callback(err, error);
// 					} else {
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

// 내가 좋아요 한 값인지 확인
var myGoodCheck = function (datas, nums, list, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var i = 0;
			var sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE id=? AND num=?';
			async.each(nums, function (number, callback) {
				conn.query(sql, [datas[6], number], function (err, count) {
					if(err) {
						var error = 'myGoodCheck_error';
						callback(err, error);
					} else {
						list[i].myGood = count[0].cnt;
						// 시간계산
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

exports.contentSearch2 = function (datas, callback) {
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