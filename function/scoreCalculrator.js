// DB 연결 파일 require
var pool = require('../dbConfig');
// async
var async = require('async');

// “한 달동안 쓴 글의 갯수” * 0.1 + “한 달동안 쓴 글에서 받은 공감” * 1 + “한 달동안 쓴 댓글에서 받은 공감” * 0.8  + “댓글 단 수” * 0.7  + “공감 누른 수” * 0.5  = ???
var scoreCalaulator = function (array) {
	//

}

module.exports = scoreCalaulator;