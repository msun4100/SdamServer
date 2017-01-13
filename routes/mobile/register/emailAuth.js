// emailAuth.js

var express = require('express');
var router = express.Router();

var db = require('../../db_modules/register/emailAuth');

router.get('/:authNum', function (req, res) {
	var userId = req.session.userId;
	var authNum = req.params.authNum;
	// console.log('userId : ', userId);
	// var url = req.originalUrl;
	// var sliceUrl = url.split('?');
	// var authNum = sliceUrl[1];
	// var registryNum;

	console.log('authNum : ', authNum);

	if(sliceUrl === undefined) {
		res.json({
			"success" : 0,
			"work" : "emailAuth",
			"result" : "authNum_undefined"
		});
	} else {
		var datas = [userId, authNum];
		db.authCheck(datas, function (result) {
			if(result === true) {
				res.json({
					"success" : 1,
					"work" : "emailAuth",
					"result" : "ok"
				});
			} else if(result === 'authNum_differ') {
				res.json({
					"success" : 0,
					"work" : "emailAuth",
					"result" : "authNum_differ"
				});
			}
		});
	}
});

module.exports = router;