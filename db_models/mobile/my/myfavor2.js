// myfavor2.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async 모듈
var async = require('async');
// 시간 계산 함수
var timeGap = require('../../../function/timeGap');
// 글번호 배열 정렬을 위한 함수
var bubleSort = require('../../../function/bubleSort');
// 중복 제거 함수
var noDupArray = require('../../../function/noDupArray');

// 관심있는 글번호 목록
var getNumList = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			var sql = "SELECT num FROM favor_view WHERE id=? AND num<? GROUP BY num ORDER BY num DESC LIMIT 20"
			conn.query(sql, [datas[2], datas[3]],function (err, rows) {
				if(err) {
					var error = 'getNumList_error';
					conn.release();
					callback(err, error);
				} else {
					// 키값에서 값의 형태로 변경
					var numList = [];
					for(i=0; i<rows.length; i++) {
						numList.push(rows[i].num);
					}

					conn.release();
					callback(null, datas, numList);
				}
			});
		}
	});
}

// 좋아요 한 글번호 목록
var getGoodList = function (datas, numList, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = "SELECT num FROM goodwrite WHERE id=?";
			conn.query(sql, [datas[2], datas[3]], function (err, rows) {
				if(err) {
					var error = 'goodList_error';
					conn.release();
					callback(err, error);
				} else {
					// 키:값 의 형태에서 값의 형태로 변경
					var goodNums = [];
					for(i=0; i<rows.length; i++) {
						goodNums.push(rows[i].num);
					}

					conn.release();
					callback(null, datas, numList, goodNums);
				}
			});
		}
	});
}

// 글 목록
var getList = function (datas, numList, goodNums, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			var sql = 'SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE num=?';
			// 글목록 이므로 배열에 담는다.
			var favorList = [];
			async.each(numList, function (number, callback) {
				conn.query(sql, [datas[0], datas[1], datas[0], number], function (err, list) {
					if(err) {
						var error = 'getList_error';
						callback(err, error);
					} else {
						// goodList에 해당하는 number 값이면 myGood 값 1로
						// 아닌 경우 myGood 값 0으로
						if(goodNums.indexOf(number) == -1) {
							list[0].myGood = 0;
						} else {
							list[0].myGood = 1;
						}
						// 시간 계산추가
						timeGap(0, list);
						favorList.push(list[0]);
					}
					callback();
				});
			}, function (err, error) {
				if(err) {
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, favorList);
				}
			});
		}
	});
}

exports.myfavor2 = function (datas, callback) {
	async.waterfall([
		function (result) {
			getNumList(datas, result);
		}, function (datas, numList, callback) {
			getGoodList(datas, numList, callback);
		}, function (datas, numList, goodNums, callback) {
			getList(datas, numList, goodNums, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}