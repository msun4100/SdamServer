// articleJson
var articleJson = function (i ,data) {
	var article;
	// result 값에서 게시글 정보를 json 객체로로 변경
	if(data[i].unlocate === 1 || data[i].distance === null) {
		// 거리값 공개 아닌 경우 99999으로 표기
		article = {
			"num" : data[i].num,
			"writer" : data[i].writer,
			"locate" : 99999,
			"locked" : data[i].locked,
			"content" : data[i].content,
			"repNum" : data[i].reply_count,
			"goodNum" : data[i].good_count,
			"myGood" : data[i].myGood,
			"timeStamp" : {
				"time" : data[i].time_unit,
				"value" : data[i].time_value
			},
			"emotion" : data[i].emotion,
			"category" : data[i].category,
			"image" : data[i].image
		};
	} else {
		// 거리값 표기하는 경우
		article = {
			"num" : data[i].num,
			"writer" : data[i].writer,
			"locate" : data[i].distance,
			"locked" : data[i].locked,
			"content" : data[i].content,
			"repNum" : data[i].reply_count,
			"goodNum" : data[i].good_count,
			"myGood" : data[i].myGood,
			"timeStamp" : {
				"time" : data[i].time_unit,
				"value" : data[i].time_value
			},
			"emotion" : data[i].emotion,
			"category" : data[i].category,
			"image" : data[i].image
		};
	}
	return article;
};

module.exports = articleJson;