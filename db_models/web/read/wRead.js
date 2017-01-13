// read.js

// DB 연결 파일 require
var pool = require('../dbAdmin');
// async
var async = require('async');

// datas = [num];

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
			conn.query(sql, datas, function (err, rows) {	// 1회
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
			var sql = "SELECT num, writer, content, emotion, category, image, DATE_FORMAT(reg_date, '%Y-%c-%d %H:%i:%s') AS regDate, locked, good_count, reply_count FROM all_view WHERE num =?"
			conn.query(sql, datas, function (err, rows) {
				if(err) {
					// query error
					var error = 'readArticle_error';
					conn.release();
					callback(err, error);
				} else {
					// 게시물 query 완료
					var articleData = rows[0];
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
			var sql = "SELECT num, reply_num, reply_writer, nickname, DATE_FORMAT(reg_date, '%Y-%c-%d %H:%i:%s') AS regDate, content, good_count FROM reply_view WHERE num=? ORDER BY reg_date DESC";
			conn.query(sql, datas, function (err, repData) {
				if(err) {					// query error
					var error = 'readReplies_error';
					conn.release();
					callback(err, error);
				} else {
					// articleData : 게시글 정보, repData 댓글 정보

					var nickArray = [ 	"담쟁이", "바람꽃", "장미", "백일홍", "어리연", "금잔화", "베고니아", "메리골드", "게발선인장", "해바라기", "나팔꽃", "초롱꽃", "복수초", "원추리", "쑥부쟁이", "무궁화", "노루귀", "칼랑코에", "데이지", "수선화", "팬지", "히아신스", "삿갓나물", "개감수", "앵초", "금불초", "남산제비꽃", "개별꽃", "벌노랑이", "과꽃", "강아지풀", "패랭이꽃", "갈퀴나물", "울릉국화", "개느삼", "연잎꿩의다리", "개가시나무", "흰진교", "황기", "황금", "라벤더", "페퍼민트", "로즈마리", "캐모마일", "재스민", "시계초", "보리지", "클라리세이지", "아니카", "스파티움", "스위트바질", "다크오팔바질", "쵸코민트", "파인애플민트", "란타나", "애플민트", "레몬바질", "오롱코롱민트", "레몬밤", "타임", "골든레몬타임", "레몬타임", "히솝", "장미허브", "애플사이다제라늄", "애플제라늄", "오레가노", "세이지", "파인애플세이지", "마조람", "보리지", "로즈힘", "펜넬", "타임", "세이지", "스피아민트", "레몬티트리", "레몬버베나", "브로니아", "차이브", "체리세이지", "로즈 제라늄", "야로우", "나스터 츔", "한련화", "아티초코", "레몬민트", "클리핑타임", "백리향", "소나무", "메타세콰이아", "푸른구상", "전나무", "개잎갈나무", "눈측백", "잎갈나무", "일본잎갈나무", "분비나무", "개비자나무", "개나리" ];

					// 댓글 번호만 따로 배열로 만든다.
					var repNums = [];

					// 댓글이 있을 경우
					if(repData.length > 0) {
						// 닉네임 변환 후 댓글 번호들을 배열에 추가
						for(i = 0; i < repData.length; i++) {
							repData[i].realNick = nickArray[repData[i].nickname];
							repNums.push(repData[i].reply_num);
						}
					}

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
						articleData.repList=[];
						articleData.repList = repData;

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

exports.read = function (datas, callback) {
	async.waterfall([
		function (callback) {
			readArticle(datas, callback);
		}, /*function (datas, articleData, callback) {
			myGoodCheck(datas, articleData, callback);
		},*/ function (datas, articleData, callback) {
			readReplies(datas, articleData, callback);
		}, /*function (datas, repNums, repData, articleData, callback) {
			repliesMyGood(datas, repNums, repData, articleData, callback);
		},*/ function (datas, repNums, repData, articleData, callback) {
			getBestReply(datas, repNums, repData, articleData, callback);
		}, function (bRindex, datas, repNumArray, repData, articleData, callback) {
			readTag(bRindex, datas, repNumArray, repData, articleData, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}