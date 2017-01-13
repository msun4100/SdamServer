// repliesJson
var repliesJson = function (i, id, data, writer) {
	// 댓글 정보를 하나하나 json 객체로 만들고 댓글 배열에 입력
	var replies = [];
	if(data.arr === undefined) {
		// 댓글이 존재하지 않는 경우
		replies = null;
	} else {
		// 댓글이 존재하는 경우
		for(i=0; i<data.arr.length; i++) {
			// replies 배열의 원소 reply
			if(writer === data.arr[i].reply_writer) {
				// 글쓴이와 댓글쓴이가 동일한 경우
				if(data.arr[i].tag === null) {
					// tag 값이 없는 경우
					if(data.arr[i].reply_writer === id) {
						// 현재 사용자의 정보와 댓글쓴이가 같은 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 1,
						"master" : 1,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : null
						};
					} else {
						// 현재 사용자의 정보와 댓글쓴이가 다른 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 0,
						"master" : 1,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : null
						};
					}
				} else {
					// tag 있는 경우
					if(data.arr[i].reply_writer === id) {
						// 현재 사용자 정보와 댓글쓴이가 같은 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 1,
						"master" : 1,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : data.arr[i].tag
						};
					} else {
						// 현재 사용자의 정보와 댓글쓴이가 다른 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 0,
						"master" : 1,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : data.arr[i].tag
						};
					}
				}
			} else {
				// 글쓴이와 댓글쓴이가 다른 경우
				if(data.arr[i].tag === null) {
					// tag 값이 없는 경우
					if(data.arr[i].reply_writer === id) {
						// 현재 사용자의 정보와 댓글쓴이가 같은 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 1,
						"master" : 0,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : null
						};
					} else {
						// 현재 사용자의 정보와 댓글쓴이가 다른 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 0,
						"master" : 0,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : null
						};
					}
				} else {
					// replies 배열의 원소 reply
					// tag 있는 경우
					if(data.arr[i].reply_writer === id) {
						// 현재 사용자 정보와 댓글쓴이가 같은 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 1,
						"master" : 0,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : data.arr[i].tag
						};
					} else {
						// 현재 사용자의 정보와 댓글쓴이가 다른 경우
						reply = {
						"repNum" : data.arr[i].reply_num,
						"repAuthor" : data.arr[i].reply_writer,
						"active" : data.arr[i].active,
						"me" : 0,
						"master" : 0,
						"timeStamp" : {
							"time" : data.arr[i].time_unit,
							"value" : data.arr[i].time_value
						},
						"repContent" : data.arr[i].content,
						"repGoodNum" : data.arr[i].good_count,
						"myGood" : data.arr[i].myGood,
						"nickname" : data.arr[i].nickname,
						"tag" : data.arr[i].tag
						};
					}
				}
			}
			replies.push(reply);
		}
	}
	return(replies);
};

module.exports = repliesJson;