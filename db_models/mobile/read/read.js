// read.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async
var async = require('async');
// 시간 계산 함수
var timeGap = require('../../../function/timeGap');
// 댓글 시간 계산 함수
var rTimeGap = require('../../../function/rTimeGap');

// datas = [num, latitude, logitude, id];

// 조회수 증가
var clickNum = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			// 조회수 1 증가
			var sql = 'UPDATE board SET click_num = click_num+1 WHERE num=?';
			conn.query(sql, datas[0], function (err, rows) {	// 1회
				if(err) {
					// query error
					var error = 'clickNum_error';
					conn.release();
					callback(err, error);
				} else {
					// query 성공
					if(rows.affectedRows === 1) {
						conn.release();
						callback(null, datas);
					}
				}
			});
		}
	});
}

// 게시물 정보 조회
var readArticle = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			// var sql = "SELECT b.num, b.writer, TRUNCATE((6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(b.latitude)) * COS(RADIANS(b.logitude) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(b.latitude)))), 1) AS distance, b.content, b.emotion, b.category, b.image, UNIX_TIMESTAMP(b.reg_date) AS postTime, b.age, b.unlocate, IFNULL(g.myGood, 0) AS myGood FROM board AS b JOIN (SELECT COUNT(*) AS myGood FROM goodwrite WHERE id=? AND num=?) AS g ON b.num=?";
			var sql = "SELECT num, writer, TRUNCATE((6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(logitude) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(latitude)))), 1) AS distance, content, emotion, category, image, UNIX_TIMESTAMP(reg_date) AS postTime, unlocate, locked, good_count, reply_count FROM all_view WHERE num =?"
			// conn.query(sql, [datas[1], datas[2], datas[1], datas[3], datas[0], datas[0] ], function (err, articleData) {	// 2회
			conn.query(sql, [datas[1], datas[2], datas[1], datas[0] ], function (err, articleData) {	// 2회
				// console.log('articleData : ', articleData);
				if(err) {
					// query error
					var error = 'readArticle_error';
					conn.release();
					callback(err, error);
				} else {
					// 게시물 query 완료
					// 시간계산
					timeGap(0, articleData);
					conn.release();
					callback(null, datas, articleData);
				}
			});
		}
	});
}

var myGoodCheck = function (datas, articleData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = "DB_connection_error";
			callback(err, error);
		} else {
			var sql = "SELECT COUNT(*) AS cnt FROM goodwrite WHERE num=? AND id=?";
			conn.query(sql, [datas[0], datas[3]], function (err, row) {
				if(err) {
					var error = "myGoodCheck_error";
					conn.release();
					callback(err, error);
				} else {
					articleData[0].myGood = row[0].cnt;
					conn.release();
					callback(null, datas, articleData);
				}
			});
		}
	});
}


// 댓글 정보
var readReplies = function (datas, articleData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			// var sql = 'SELECT num, reply_num, reply_writer, active, nickname, UNIX_TIMESTAMP(reg_date) AS rTime, content FROM reply WHERE num=? ORDER BY reply_num DESC';
			var sql = "SELECT num, reply_num, reply_writer, active, nickname, UNIX_TIMESTAMP(reg_date) AS rTime, content, good_count FROM reply_view WHERE num=? ORDER BY reg_date DESC";
			conn.query(sql, datas[0], function (err, repData) {
				if(err) {					// query error
									var error = 'readReplies_error';
					conn.release();
					callback(err, error);
				} else {
					// articleData : 게시글 정보, repData 댓글 정보

					// 댓글 번호만 따로 배열로 만든다.
					var repNums = [];

					// 댓글이 있을 경우
					if(repData.length > 0) {

						rTimeGap(repData);

						// 댓글 번호들을 배열에 추가
						for(i = 0; i < repData.length; i++) {
							repNums.push(repData[i].reply_num);
						}
					}

					// 댓글번호 갯수는 글의 댓글 수 이므로 동시에 글의 댓글 갯수도 등록한다.
					// articleData[0].reply_count = repNums.length;

					// console.log('articleData : ', articleData);
					// console.log('articleData.arr : ', articleData.arr);

					conn.release();
					callback(null, datas, repNums, repData, articleData);
				}
			});
		}
	});
}

// 내가 좋아요한 댓글인지 확인
var repliesMyGood = function (datas, repNums, repData, articleData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// 반복변수
			var i = 0;
			var sql = 'SELECT COUNT(*) AS cnt FROM goodreply WHERE num=? AND id=? AND reply_num=?';
			async.each(repNums, function (repNum, callback) {
				conn.query(sql, [datas[0], datas[3], repNum], function (err, count) {
					if(err) {
						var error = 'repliesMyGood_error';
						callback(err, error);
					} else {
						repData[i].myGood = count[0].cnt;
						i++;
					}
					callback();
				});
			}, function (err, error) {
				conn.release();
				if(err) {
					callback(err, error);
				} else {
					callback(null, datas, repNums, repData, articleData);
				}
 			});
		}
	});
}

var getBestReply = function (datas, repNums, repData, articleData, callback) {
	// Best 댓글 산출
	// 기존에 가져온 댓글 정보에서 Best 댓글 산출

	// 베스트 댓글의 인덱스 담을 변수
	var bRindex = null;
	// 각 댓글의 좋아요 갯수를 비교하고 가장 큰 값의 댓글 번호만 얻는다.
	for(i=0; i<repData.length; i++) {
		// 좋아요 값, 등록일 값 저장하는 임시 배열
		// 시작시 arr[0] 번째 댓글의 좋아요 값과 등록일 값저장
		var temp = [repData[0].good_count, repData[0].rTime];
		// console.log('temp : ', temp);
		// 이후 비교실시
		if(temp[0] < repData[i].good_count) {
			// 현재 좋아요 값이 이전 값보다 클 경우
			// 좋아요 값이 10 이상인지 확인하여 10이상 일 경우에만
			if(repData[i].good_count >= 10) {
				// temp 배열을 최신화하고 댓글번호 저장
				temp[0] = repData[i].good_count;
				temp[1] = repData[i].rTime;
				bRindex = i;	// 댓글인덱스 저장
			}
		} else if(temp[0] == repData[i].good_count) {
			// 현재 좋아요 값과 같을 경우
			if(temp[1] == repData[i].rTime) {
				// 첫번째 댓글일 경우 등록 시간이 동일
				// 좋아요 값이 10 이상인지 확인하여 10이상 일 경우에만
				if(repData[i].good_count >= 10) {
					// 해당 댓글 번호를 저장
					bRindex = i;
				}
			} else {
				// 좋아요 값이 10 이상인지 확인하여 10이상 일 경우에만
				if(repData[i].good_count >= 10) {
					if(temp[1] < repData[i].rTime) {
						// 등록시간이 나중인 값으로 temp 배열을 최신화 하고
						// 해당 댓글 번호를 저장
						temp[0] = repData[i].good_count;
						temp[1] = repData[i].rTime;
						bRindex = i;
					}
				}
			}
		}
	}	// for문 종료시 best 댓글이 존재하면 해당 댓글의 배열 인덱스를 bRindex 변수에 얻는다.
	// best 댓글에도 tag가 있을 수 있으므로 최종 추가는 tag 정보 얻은 후에 한다.

	// 댓글번호 배열에서 가장 큰값과 가장 작은 값을 가져온다.
	var repNumArray = [];

	if(repNums.length !== 0) {
		var min = repNums.reduce( function (previous, current) {
			return previous < current ? previous:current;
		});

		var max = repNums.reduce( function (previous, current) {
			return previous > current ? previous:current;
		});

		repNumArray.push(min);
		repNumArray.push(max);
	}

	callback(null, bRindex, datas, repNumArray, repData, articleData);
}

// 댓글에 태그정보추가
var readTag = function (bRindex, datas, repNumArray, repData, articleData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// 댓글이 있는 경우
			if(repData.length !== 0) {
				var sql = 'SELECT reply_num, tag_id, tag_nick FROM tag WHERE num=? AND reply_num BETWEEN ? AND ?';
				conn.query(sql, [datas[0], repNumArray[0], repNumArray[1]], function (err, tagData) {
					if(err) {
						// query error
						var error = 'readTag_error';
						conn.release();
						callback(err, error);
					} else {
						// tag 정보 있을 경우
						if(tagData.length > 0) {
							// tag 정보 댓글에 추가
							for(i=0; i<repData.length; i++) {
								repData[i].tag = [];
								for(j=0; j<tagData.length; j++) {
									if(repData[i].reply_num == tagData[j].reply_num) {
										repData[i].tag.push(tagData[j].tag_nick);
									}
								}
							}
						} else {
							// tag정보 없을 경우
							for(i=0; i<repData.length; i++) {
								repData[i].tag = [];
							}
						}

						// best 댓글 추가
						// bRindex 초기값이 null 이므로
						// bRindex 값이 null 이면 best 댓글이 없다.
						if(bRindex !== null) {
							// 글정보에 값에 Best 댓글 정보를 입력
							articleData.push(repData[bRindex]);
						}

						// 글정보에 댓글정보 입력
						articleData.arr=[];
						articleData.arr = repData;
						// console.log('articleData : ', articleData);

						conn.release();
						callback(null, articleData);
					}
				});
			} else {
				// 댓글 없는 경우
				conn.release();
				callback(null, articleData);
			}
		}
	});
}

exports.read=function (datas, callback) {
	async.waterfall([
		function (callback) {
			clickNum(datas, callback);
		}, function (datas, callback) {
			readArticle(datas, callback);
		}, function (datas, articleData, callback) {
			myGoodCheck(datas, articleData, callback);
		}, function (datas, articleData, callback) {
			readReplies(datas, articleData, callback);
		}, function (datas, repNums, repData, articleData, callback) {
			repliesMyGood(datas, repNums, repData, articleData, callback);
		}, function (datas, repNums, repData, articleData, callback) {
			getBestReply(datas, repNums, repData, articleData, callback);
		}, function (bRindex, datas, repNumArray, repData, articleData, callback) {
			readTag(bRindex, datas, repNumArray, repData, articleData, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}