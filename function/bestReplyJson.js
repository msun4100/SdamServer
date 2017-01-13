// bestReplyJson
var bestReplyJson = function (i, id, data, len, writer) {
	var bestReply;
	if(data.length === len) {
		// bestReply 존재하는 경우
		if(data[i].tag === null) {
			// bestReply 에 tag 값 없는 경우
			if(writer === data[i].reply_writer) {
				// 글쓴이와 best댓글쓴이가 동일한 경우
				if(data[i].reply_writer === id) {
					// 현재 사용자와 댓글쓴이가 같은 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 1,
						"master" : 1,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : null
					};
				} else {
					// 현재 사용자와 댓글쓴이가 다른 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 0,
						"master" : 1,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : null
					};
				}
			} else {
				// 글쓴이와 best댓글쓴이가 다른 경우
				if(data[i].reply_writer === id) {
					// 현재 사용자와 댓글쓴이가 같은 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 1,
						"master" : 0,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : null
					};
				} else {
					// 현재 사용자와 댓글쓴이가 다른 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 0,
						"master" : 0,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : null
					};
				}
			}
		} else {
			// bestReply에 tag 값 있는 경우
			if(writer === data[i].reply_writer) {
				// 글쓴이와 best댓글쓴이가 동일한 경우
				if(data[i].reply_writer === id) {
					// 현재 사용자와 댓글쓴이가 같은 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 1,
						"master" : 1,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : data[i].tag
					};
				} else {
					// 현재 사용자와 댓글쓴이가 다른 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 0,
						"master" : 1,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : data[i].tag
					};
				}
			} else {
				// 글쓴이와 best댓글쓴이가 다른 경우
				if(data[i].reply_writer === id) {
					// 현재 사용자와 댓글쓴이가 같은 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 1,
						"master" : 0,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : data[i].tag
					};
				} else {
					// 현재 사용자와 댓글쓴이가 다른 경우
					bestReply = {
						"repNum" : data[i].reply_num,
						"repAuthor" : data[i].reply_writer,
						"active" : data[i].active,
						"me" : 0,
						"master" : 0,
						"timeStamp" : {
							"time" : data[i].time_unit,
							"value" : data[i].time_value
						},
						"repContent" : data[i].content,
						"repGoodNum" : data[i].good_count,
						"myGood" : data[i].myGood,
						"nickname" : data[i].nickname,
						"tag" : data[i].tag
					};
				}
			}
		}
	} else  {
		// bestReply 없는 경우
		bestReply = null;
	}
	return(bestReply);
};

module.exports = bestReplyJson;