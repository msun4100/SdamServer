// wReply.js
var express = require('express');
var router = express.Router();

// DB 연결
var db = require('../../../db_models/web/write/wReply');
// push
var pushNoti = require('../../../function/pushNoti');
// setNick
var setNickname = require('../../../function/setNickname');

// 댓글 쓰기
router.post('/', function (req, res) {

	// console.log(req.body);

	var userId = req.session.userId;	// session 에 저장된 값
	var num = req.body.num;		// 글 번호값
	var page = req.body.page;		// 글이 있는 페이지 정보
	var writer = req.body.writer;	// 글의 글쓴이 정보
	var content = req.body.replyContent;
	var tagIds = req.body.tagIds;	// 배열형태로 받는 정보
	var tagNicks = req.body.tagNicks;	// 배열형태로 받는 정보

	// 여기서 부터
	var replyWriters = req.body.replyWriters;	// 댓글쓴이 정보
	var replyWriterArray = replyWriters.split(",");	// 댓글쓴이 값의 배열
	console.log('replyWriterArray : ', replyWriterArray);
	// 여기까지 작동 안 함

	var nicknames = req.body.nicknames;	// 현재 존재하는 닉네임 값, string
	console.log('nicknames : ', nicknames);
	var nickArray = nicknames.split(",");	// 현재 존재하는 닉네임 값의 배열
	console.log('nickArray : ', nickArray);
	var nickname;	// 새로 정한 닉네임

	if(writer === userId) {	// 글쓴이와 댓글쓴이 동일
		nickname = 0;	// 닉네임 담쟁이
	} else if(replyWriterArray.indexOf(userId) > -1) {	// 댓글 작성자가 이전에 댓글을 쓴 경우
		// 이전에 사용한 닉네임을 그대로 사용
		var index = replyWriterArray.indexOf(userId);
		nickname = nickArray[index];
		// console.log('nickname : ', nickname);
	} else {
		// 처음 작성하는 경우
		nickname = setNickname(nickArray);
		// console.log("nickname : ", nickname);
	}

	if(tagIds === undefined) {
		tagIds = null;
	}

	if(tagNicks === undefined) {
		tagNicks = null;
	}

	if(num === undefined) {
		res.send('<script>alert("서버에서 데이타를 받는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
	} else if(writer === undefined) {
		res.send('<script>alert("서버에서 데이타를 받는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
	} else if(userId === undefined) {
		res.send('<script>alert("서버에서 데이타를 받는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
	} else if(content === undefined) {
		res.send('<script>alert("서버에서 데이타를 받는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
	} else {

		var datas = [num, writer, userId, content, nickname, tagIds, tagNicks];
		// console.log('datas : ', datas);

		// 댓글 배열과 pushId 배열을 db작업 결과로 얻음
		db.wReply(datas, function (result) {
			if(result === 'DB_connection_error') {
				// DB 연결 error
				res.send('<script>alert("데이타 베이스에 접속하는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
			} else if (result === 'writeReply_error') {
				// 댓글 등록 실패
				res.send('<script>alert("댓글을 등록하는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
			} else if(result === 'insertTag_error') {
				res.send('<script>alert("태그를 등록하는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
			} else if(result === 'readReplies_error') {
				res.send('<script>alert("글을 불러오는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
			} else if(result === 'readTag_error') {
				res.send('<script>alert("태그 정보를 받는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
			} else if(result === 'getPushId_error') {
				res.send('<script>alert("푸시정보를 받는데 문제가 생겼습니다.\n이전페이지로 돌아갑니다.");history.back();</alert>');
			} else {
				// 성공시
				var writerPush;

				// 글 작성자에게 댓글 푸시
				// 배열의 맨 마지막 원소를 빼서 새로운 배열을 생성
				// 기존 배열에서는 맨 마지막 원소만 빠진다.
				var writerPush = [result.pop()];

				if(result.indexOf(writerPush) > 0 || result.length > 0) {
				// 글쓴이가 댓글달았는데 태그당한 경우
				// 또는 댓글에 태그가 있는 경우
					pushNoti(num, null, 'tag', result);
				} else if(writer !== userId) {		// 다른사람의 글에 댓글 단 경우 글의 작성자에게 push
					pushNoti(num, null, 'reply', writerPush);
				}
			}
		});

		res.redirect("/wRead/" + page + "/" + num);
	}
});

module.exports = router;