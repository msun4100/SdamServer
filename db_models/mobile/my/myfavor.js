// myfavor.js

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
			var sql = "SELECT num FROM favor_view WHERE id=? GROUP BY num ORDER BY num DESC LIMIT 20"
			conn.query(sql, datas[2], function (err, rows) {
				if(err) {
					var error = 'getNumList_error';
					conn.release();
					callback(err, error);
				} else {
					// 키:값 의 형태에서 값의 형태로 변경
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
			conn.query(sql, datas[2], function (err, rows) {
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

exports.myfavor = function (datas, callback) {
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


// // 댓글 단 목록
// var repList = function (datas, callback) {
// 	pool.getConnection(function (err, conn) {
// 		if(err) {
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			// DB 연결
// 			var sql = 'SELECT num FROM reply WHERE reply_writer=? GROUP BY num ORDER BY num DESC';
// 			conn.query(sql, datas[0], function (err, replyList) {
// 				if(err) {
// 					var error = 'repList_error';
// 					conn.release();
// 					callback(err, error);
// 				} else {
// 					conn.release();
// 					callback(null, datas, replyList);
// 				}
// 			});
// 		}
// 	});
// }

// // 좋아요 누른 목록
// var goodList = function (datas, replyList, callback) {
// 	pool.getConnection(function (err, conn) {
// 		if(err) {
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			// DB 연결
// 			var sql = 'SELECT num FROM goodwrite WHERE id=? GROUP BY num ORDER BY num DESC';
// 			conn.query(sql, datas[0], function (err, goodList) {
// 				if(err) {
// 					var error = 'goodList_error';
// 					conn.release();
// 					callback(err, error);
// 				} else {
// 					conn.release();
// 					callback(null, datas, replyList, goodList);
// 				}
// 			});
// 		}
// 	});
// }

// var makeArray = function (datas, replyList, goodList, callback) {

// 	// 배열 합치기
// 	var array = replyList.concat(goodList);

// 	// 배열 형태 변경 키 : 값 에서 값으로
// 	var array2=[];
// 	for(i=0; i<array.length; i++) {
// 		array2.push(array[i].num);
// 	}

// 	// 중복값 제거
// 	var array3 = noDupArray(array2);
// 	// 1,2,3 순서로 정렬
// 	var array4 = array3.sort(bubleSort);
// 	// 역순으로 정렬
// 	var nums = array4.reverse();

// 	// goodList 형태를 글번호만 가진 배열로 변경
// 	var tempArray = [];
// 	for(i=0; i<goodList.length; i++) {
// 		var temp = goodList[i].num;
// 		tempArray.push(temp);
// 	}

// 	goodList = tempArray;
// 	// console.log('nums : ', nums);
// 	// console.log('LengthOfNums : ', nums.length);
// 	callback(null, datas, goodList, nums);
// }

// // 글 목록
// var getList = function (datas, goodList, nums, callback) {
// 	pool.getConnection(function (err, conn) {
// 		if(err) {
// 			var error = 'DB_connection_error';
// 			callback(err, error);
// 		} else {
// 			// DB 연결
// 			var myFavors = [];
// 			var sql = 'SELECT num, writer, TRUNCATE( (6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( logitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, age FROM board WHERE num=?';
// 			// 글목록 이므로 배열에 담는다.
// 			async.each(nums, function (number, callback) {
// 				conn.query(sql, [datas[2], datas[3], datas[2], number], function (err, list) {
// 					if(err) {
// 						var error = 'getList_error';
// 						callback(err, error);
// 					} else {
// 						// goodList에 해당하는 number 값이면 myGood 값 1로
// 						// 아닌 경우 myGood 값 0으로
// 						if(goodList.indexOf(number) == -1) {
// 							list[0].myGood = 0;
// 						} else {
// 							list[0].myGood = 1;
// 						}
// 						// 배열에 값을 넣음
// 						myFavors.push(list[0]);
// 					}
// 					callback();
// 				});
// 			}, function (err, error) {
// 				if(err) {
// 					conn.release();
// 					callback(err, error);
// 				} else {
// 					conn.release();
// 					callback(null, nums, myFavors);
// 				}
// 			});
// 		}
// 	});
// }

// // 좋아요 갯수 추가
// var goodCount = function (nums, list, callback) {
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
// 						list[i].good_count = count[0].cnt;
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
// 					callback(null, nums, list);
// 				}
// 			});
// 		}
// 	});
// }

// // 댓글 갯수 추가
// var replyCount = function (nums, list, callback) {
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
// 					callback(null, list);
// 				}
// 			});
// 		}
// 	});
// }

// exports.myfavor = function (datas, callback) {
// 	async.waterfall([
// 		function (result) {
// 			repList(datas, result);
// 		}, function (datas, repList, callback) {
// 			goodList(datas, repList, callback);
// 		}, function (datas, repList, goodList, callback) {
// 			makeArray(datas, repList, goodList, callback);
// 		}, function (datas, goodList, nums, callback) {
// 			getList(datas, goodList, nums, callback);
// 		}, function (nums, list, callback) {
// 			goodCount(nums, list, callback);
// 		}, function (nums, list, callback) {
// 			replyCount(nums, list, callback);
// 		}
// 	], function (err, result) {
// 		if(err) console.log('err : ', err);
// 		callback(result);
// 	});
// }
