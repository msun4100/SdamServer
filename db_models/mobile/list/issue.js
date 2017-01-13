// issue.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async 모듈
var async = require('async');
// 시간 계산 함수
var timeGap = require('../../../function/timeGap');

// 글목록 불러오기
var getList = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT num, writer, IFNULL(TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1), 99999) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE prior=0 AND locked=0 AND reg_date BETWEEN DATE_ADD(NOW(), INTERVAL -1 MONTH) AND NOW() ORDER BY reply_count DESC, good_count DESC LIMIT 20';
			conn.query(sql, [ datas[0], datas[1], datas[0]], function (err, list) {
				if(err) {
					// query error
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

// 댓글갯수 추가
// var replyCount = function (datas, nums, list, callback) {
// 	pool.getConnection(function (err, conn) {
// 		if(err) {
// 			// DB 연결 error
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			var i = 0;
// 			// 댓글 갯수 추가
// 			sql = 'SELECT COUNT(*) AS cnt FROM reply WHERE num=?';
// 			async.each(nums, function (number, callback) {
// 				conn.query(sql, number, function (err, count) {
// 					if(err) {
// 						// query error
// 						var error = 'replyCount_error';
// 					} else {
// 						// 갯수 가져오기 성공
// 						// 글 값 변수에 댓글 수  값 추가
// 						list[i].reply_count = count[0].cnt;
// 						// 시간계산도 추가
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

// 내가 좋아요 했는지 확인
var myGoodCheck = function (datas, nums, list, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var i = 0;
			// 내가 좋아요한 값 추가
			sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE id=? AND num=?';
			async.each(nums, function (number, callback) {
				conn.query(sql, [datas[2], number], function (err, count) {
					if(err) {
						// query error
						var error = 'myGoodCheck_error';
					} else {
						// 갯수 가져오기 성공
						// 글 값 변수에 댓글 수  값 추가
						list[i].myGood = count[0].cnt;
						// 시간계산도 추가
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

// 3달 이내 글 중 좋아요 갯수 많은 수대로
exports.issue = function (datas, callback) {
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