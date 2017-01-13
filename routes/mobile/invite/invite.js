// invite.js
var express = require('express');
var router = express.Router();

// 초대하기
router.post('/', function (req, res) {
	var id = req.body.userId;	// session에 저장된 값
	// 1000~9999 까지 난수
	var inviteNum = Math.floor(Math.random()*(9999-1000 +1 )) + 1000;

	/*  member 테이블의 invite값 1 감소
	인증번호 생성 후 이를 초대장에 실어서 보냄 */

	// 성공시
	res.json({
		"success" : 1,
		"work" : "invite",
		"value" : inviteNum
	});
});

module.exports = router;