// reply.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/mobile/write/reply');
// bestReply
var bestReplyJson = require('../../../function/bestReplyJson');
// repliesJson
var repliesJson = require('../../../function/repliesJson');
// push
var pushNoti = require('../../../function/pushNoti');

// 댓글 쓰기
router.post('/', function (req, res) {	var userId = req.session.userId;	// session 에 저장된 값
	var num = req.body.num;		// 글 번호값
	var writer = req.body.writer;	// 글의 글쓴이 정보
	var content = req.body.content;
	var tagIds = req.body.tagIds;	// 배열형태로 받는 정보
	var tagNicks = req.body.tagNicks;	// 배열형태로 받는 정보
	var nickname = req.body.nickname;

	if(tagIds === undefined) {
		tagIds = null;
	}

	if(tagNicks === undefined) {
		tagNicks = null;
	}

	if(num === undefined) {
		res.json({
			"success" : 0,
			"work" : "num_undefined",
			"result" : null
		});
	} else if(writer === undefined) {
		res.json({
			"success" : 0,
			"work" : "writer_undefined",
			"result" : null
		});
	} else if(userId === undefined) {
		res.json({
			"success" : 0,
			"work" : "userId_undefined",
			"result" : null
		});
	} else if(content === undefined) {
		res.json({
			"success" : 0,
			"work" : "content_undefined",
			"result" : null
		});
	} else if(nickname === undefined) {
		res.json({
			"success" : 0,
			"work" : "nickname_undefined",
			"result" : null
		});
	} else {

		var datas = [num, writer, userId, content, nickname, tagIds, tagNicks];

		// 댓글 배열과 pushId 배열을 db작업 결과로 얻음
		db.reply(datas, function (result, pushIds) {
			if(result === 'DB_connection_error') {
				// DB 연결 error
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if (result === 'writeReply_error') {
				// 댓글 등록 실패
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'insertTag_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'readReplies_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'repliesMyGood_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'repliesGoodNum_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'readTag_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'getPushId_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
				// 성공시
				var bestReply, replies, writerPush;

				// 글 작성자에게 댓글 푸시
				// 배열의 맨 마지막 원소를 빼서 새로운 배열을 생성
				// 기존 배열에서는 맨 마지막 원소만 빠진다.
				var writerPush = [pushIds.pop()];

				var i;
				bestReply = bestReplyJson(0, userId, result, 1, writer);
				replies = repliesJson(i, userId, result, writer);
				// console.log('bestReply : ', bestReply);
				// console.log('replies : ', replies);

				res.json({
					"success" : 1,
					"work" : "write_reply",
					"result" : {
						"article" : null,
						"bestReply" : bestReply,
						"replies" : replies
					}
				});

				if(pushIds.indexOf(writerPush) > 0 || pushIds.length > 0) {
				// 글쓴이가 댓글달았는데 태그당한 경우
				// 또는 댓글에 태그가 있는 경우
					pushNoti(num, null, 'tag', pushIds);
				} else if(writer !== userId) {		// 다른사람의 글에 댓글 단 경우 글의 작성자에게 push
					pushNoti(num, null, 'reply', writerPush);
				}

				// if(writer !== userId) {		// 작성자에게 push
				// 	pushNoti(num, null, 'reply', writerPush);
				// }

				// if(pushIds.length > 0) {	// 댓글 태그가 있는 경우
				// 	pushNoti(num, null, 'tag', pushIds);
				// }
			}
		});
	}
});

module.exports = router;