// register.js

// DB 연결 파일 require
var pool = require('../dbAdmin');
var async = require('async');

var writeNotice = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			console.log('datas : ', datas);
			var sql = "INSERT INTO board (writer, age, emotion, category, image, content, reg_date, notice) VALUES (?, ?, ?, ?, ?, ?, now(), 1)";
			conn.query(sql, datas, function (err, row) {
				if(err) {
					// query error
					var error = 'writeArticle_error';
					conn.release();
					callback(err, error);
				} else {
					// query 성공
					if(row.affectedRows == 1) {
						// INSERT 된 글번호값을 받아온다, row의 insertId 값이 기본키값
						var articleNum = parseInt(row.insertId, 10);

						conn.release();
						callback(null, datas, articleNum);
					}
				}
			});
		}
	});
}

var getPushIds = function (datas, articleNum, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = "SELECT push_id FROM member WHERE del=0";
			conn.query(sql, function (err, row) {
				if(err) {
					var error = 'getPushIds_error';
					conn.release();
					callback(err, error);
				} else {
					var result = [];
					for(i=0; i<row.length; i++) {
						if(row[i].push_id != null) {
							result.push(row[i].push_id);
						}
					}
					result.push(articleNum);

					conn.release();
					callback(null, result);
				}
			});
		}
	});
}

exports.wNWrite = function (datas, callback) {
	async.waterfall([
		function (callback) {
			writeNotice(datas, callback);
		}, function (datas, articleNum, callback) {
			getPushIds(datas, articleNum, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}