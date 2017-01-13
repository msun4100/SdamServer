// reply.js

// DB 연결 파일 require
var pool = require('../dbConfig');
// async
var async = require('async');
// 댓글 시간 계산 함수
var rTimeGap = require('../../../function/rTimeGap');

// 댓글 등록
var writeReply = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'INSERT INTO reply (num, reply_writer, content, nickname, reg_date) VALUES (?, ?, ?, ?, now())';
			conn.query(sql, [datas[0], datas[2], datas[3], datas[4], datas[5]], function (err, rows) {
				if(err) {
					// query error
					var error = 'writeReply_error';
					conn.release();
					callback(err, error);
				} else {
					if(rows.affectedRows == 1) {
						// 결과에서 입력된 댓글의 번호를 가져온다.
						var repNum = rows.insertId;
						conn.release();
						callback(null, datas, repNum);
					}
				}
			});
		}
	});
}

//datas = [num, id, content, active, nickname, tagId, tagNick];
// tagId, tagNick은 하나라도 무조건 배열형태로 받는다.

// 태그정보 입력
var insertTag = function (datas, repNum, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// tagId, tagNick 각각 배열에서 빼내어 따로 배열로 만든다
			var tagIds = datas[5];
			var tagNicks = datas[6];

			if(typeof(tagIds) === "string") {
				tagIds = [];
				tagIds.push(datas[5]);
			}
			if(typeof(tagNicks) === "string") {
				tagNicks = [];
				tagNicks.push(datas[6]);
			}

			// console.log('tagIds : ', tagIds);
			// console.log('tagNicks : ', tagNicks);

			if(tagIds !== null && tagNicks !== null) {
				var sql = 'INSERT INTO tag (num, tag_id, tag_nick, reply_num) VALUES(?, ?, ?, ?)';
				async.each(tagIds, function (tagId, callback) {
					// console.log('tagId : ', tagId);
					// console.log('tagNicks[tagIds.indexOf(tagId)] : ', tagNicks[tagIds.indexOf(tagId)]);
					conn.query(sql, [datas[0], tagId, tagNicks[tagIds.indexOf(tagId)], repNum], function (err, row) {
						if(err) {
							var error = 'insertTag_error';
							callback(err, error);
						}
						callback();
					});
				}, function (err, error) {
					if(err) {
						conn.release();
						callback(err, error);
					} else {
						conn.release();
						callback(null, datas);
					}
				});
			} else {
				conn.release();
				callback(null, datas);
			}
		}
	});
}

// 댓글 정보
var readReplies = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// DB 연결
			// var sql = 'SELECT r.num, r.reply_num, r.reply_writer, r.active, r.nickname, UNIX_TIMESTAMP(r.reg_date) AS rTime, r.content, IFNULL(g.myGood, 0) AS myGood FROM reply AS r JOIN (SELECT num, COUNT(*) AS myGood FROM goodreply WHERE num=? AND id=?) AS g ON r.num=? ORDER BY r.reply_num DESC';
			var sql = "SELECT num, reply_num, reply_writer, active, nickname, UNIX_TIMESTAMP(reg_date) AS rTime, content, good_count FROM reply_view WHERE num=? ORDER BY reg_date DESC";
			conn.query(sql, [datas[0], datas[2], datas[0]], function (err, repData) {
				if(err) {
					// query error
					var error = 'readReplies_error';
					conn.release();
					callback(err, error);
				} else {
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
					// console.log('repData : ', repData);
					conn.release();
					callback(null, datas, repNums, repData);
				}
			});
		}
	});
}

// 내가 좋아요한 댓글인지 확인
var repliesMyGood = function (datas, repNums, repData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// 반복변수
			var i = 0;
			var sql = 'SELECT COUNT(*) AS cnt FROM goodreply WHERE num=? AND id=? AND reply_num=?';
			async.each(repNums, function (repNum, callback) {
				conn.query(sql, [datas[0], datas[2], repNum], function (err, count) {
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
				if(err) {
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, datas, repNums, repData);
				}
 			});
		}
	});
}

var getBestReply = function (datas, repNums, repData, callback) {
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

	callback(null, bRindex, datas, repNumArray, repData);
}

// 댓글에 태그정보추가
var readTag = function (bRindex, datas, repNumArray, repData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB 연결 error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// 댓글이 있는 경우
			if(repNumArray.length !== 0) {
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
						// 	// tag정보 없을 경우
							for(i=0; i<repData.length; i++) {
								repData[i].tag = [];
							}
						}

						// 최종 반환할 배열
						var repliesData = [];

						// best 댓글 추가
						// bRindex 초기값이 null 이므로
						// bRindex 값이 null 이면 best 댓글이 없다.
						if(bRindex !== null) {
							// 글정보에 값에 Best 댓글 정보를 입력
							repliesData.push(repData[bRindex]);
						}
						// 글정보에 댓글정보 입력
						repliesData.arr=[];
						repliesData.arr = repData;
						// console.log('repliesData : ', repliesData);

						conn.release();
						callback(null, datas, repliesData);
					}
				});
			} else {
				// 댓글 없는 경우
				conn.release();
				callback(null, datas, repliesData);
			}
		}
	});
}

// push를 위해 pushId 뽑아오기
var getPushId = function (datas, repliesData, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			// 반복 변수
			var i = 0;
			// push_id 가져올 id 배열
			var userIds = datas[5];

			// 넘어온 태그 아이디 값이 배열이 아닌 String 인 경우
			if(typeof(userIds) === "string") {
				// 배열로 만든다.
				userIds = [];
				userIds.push(datas[5]);
			}

			// 자기 자신을 태그할 경우 푸시가 안 가도록 하기 위해
			// 태그 아이디 배열에서 댓글쓴이의 아이디가 있는지 검사후
			if(userIds != null) {
				var index = userIds.indexOf(datas[2]);
				// 있을경우 해당 원소를 배열에서 삭제
				if(index > -1) {
					userIds.splice(index, 1);
				}
			}

			if(userIds !== null) {
				// 작성자에게도 push해주어야 하므로 작성자 id를 배열의 마지막에 넣는다.
				userIds.push(datas[1]);
			} else {
				// 기존 tagId 배열이 null일 경우 작성자 id만 배열에 넣는다.
				userIds = [datas[1]];
			}

			// 반환할 id 배열
			var pushIds = [];
			var sql = 'SELECT push_id FROM member WHERE email=? AND del=0';
			async.each(userIds, function (userId, callback) {
				conn.query(sql, userId, function (err, push) {
					if(err) {
						var error = 'getPushId_error';
						callback(err, error);
					} else {
						// 배열에 select 한 push_id 추가
						pushIds.push(push[0].push_id);
						i++;
					}
					callback();
				});
			}, function (err, error) {
				if(err) {
					var error = 'getPushId_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, repliesData, pushIds);
				}
			});
		}
	});
}


exports.reply=function (datas, callback) {
	async.waterfall([
		function (callback) {
			writeReply(datas, callback);
		}, function (datas, repNum, callback) {
			insertTag(datas, repNum, callback);
		}, function (datas, callback) {
			readReplies(datas, callback);
		}, function (datas, repNums, repData, callback) {
			repliesMyGood(datas, repNums, repData, callback);
		}, function (datas, repNums, repData, callback) {
			getBestReply(datas, repNums, repData, callback);
		}, function (bRindex, datas, repNumArray, repData, callback) {
			readTag(bRindex, datas, repNumArray, repData, callback);
		}, function (datas, repliesData, callback) {
			getPushId(datas, repliesData, callback);
		}
	], function (err, repliesData, pushIds) {
		if(err) console.log('err : ', err);
		callback(repliesData, pushIds);
	});
}