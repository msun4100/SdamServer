// category2.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async 모듈
var async = require('async');
// 시간 계산 함수
var timeGap = require('../../../function/timeGap');


exports.category2 = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			console.log('err : ', err);
			result = 'DB_connection_error';
			conn.release();
			callback(result);
		} else {
			// DB연결 성공
			// 글목록 불러오기
			// sql = "SELECT b.num, FLOOR( (6371 * acos( cos( radians(?) ) * cos( radians( b.latitude ) ) * cos( radians( b.logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( b.latitude ) ) ) ) ) AS distance, b.content, b.emotion, b.category, b.image, UNIX_TIMESTAMP(b.reg_date) AS postTime, COUNT(r.reply_num) AS rep_num FROM board AS b JOIN reply AS r WHERE b.num=? AND r.num=? ORDER BY b.reg_date DESC";
			sql = "SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, age, prior FROM board WHERE age BETWEEN ? AND ? AND category=? AND prior=0 AND locked=0 AND reg_date < ? ORDER BY num DESC limit 10";
			conn.query(sql, [ datas[0], datas[1], datas[0], datas[2], datas[3], datas[6], datas[4] ], function (err, result) {
				if(err) {
					// query error
					console.log('err : ', err);
					result = 'SELECT_query_error';
					conn.release();
					callback(result);
				} else {
					// query 성공
					var nums = [];
					for(i=0; i<result.length; i++) {
						nums[i] = result[i].num;
					}

					var i = 0;
					// 글의 좋아요 갯수 추가
					sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE num=?';
					async.each(nums, function (number, callback) {
						conn.query(sql, number, function (err, count) {
							if(err) {
								// query error
								console.log('err : ', err);
								result = 'SELECT_COUNT_goodwirte_query_error';
							} else {
								// query 성공

								// 글 값 변수에 좋아요 값 추가
								result[i].good_num = count[0].cnt;

								// UNIX_TIMESTAMP 형태는 초로 변환한 시간 값, 이를 이용하여 시간차이 계산
								timeGap(i, result);
								i++;
							}
							callback();
						});
					}, function (err) {
						if(err) console.log('err : ', err);

						i = 0;
						// 댓글 갯수 추가
						sql = 'SELECT COUNT(*) AS cnt FROM reply WHERE num=?';

						async.each(nums, function (number, callback) {
							conn.query(sql, number, function (err, count) {
								if(err) {
									// query error
									console.log('err : ', err);
									result = 'SELECT_COUNT_reply_num_query_error';
								} else {
									// 갯수 가져오기 성공
									// 글 값 변수에 댓글 수  값 추가
									result[i].reply_count = count[0].cnt;
									i++;
								}
								callback();
							});
						}, function (err) {
							if(err) console.log('err : ', err);

							// 내가 좋아요 한 글인지 확인값
							i = 0;
							sql = 'SELECT COUNT(*) AS cnt FROM goodwrite WHERE id=? AND num=?';
							async.each(nums, function (number, callback) {
								conn.query(sql, [datas[5], number], function (err, count) {
									if(err) {
										// query error
										console.log('err : ', err);
										result = 'SELECT_COUNT_myGood_query_error';
									} else {
										//  query 성공
										result[i].myGood = count[0].cnt;
										i++
									}
									callback();
								});
							}, function (err) {
								if(err) console.log('err : ', err);

								conn.release();
								callback(result);
							});
						});
					});
				}
			});
		}
	});
};