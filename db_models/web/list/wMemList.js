// wAll.js

// DB 연결 파일 require
var pool = require('../dbAdmin');
// async 모듈
var async = require('async');

var memberCount = function (page, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = "SELECT COUNT(*) AS cnt FROM member";
			conn.query(sql, [], function (err, rows) {
				if(err) {
					var error = 'memberCount_error';
					conn.release();
					callback(err, error);
				} else {
					var size = 10;			// 한 페이지에 보이는 게시글 수 설정
					var begin = (page-1)*size;	// 시작글 번호 구하여 begin에 설정
					var count = rows[0].cnt;
					var totalPage = Math.ceil(count/size);	// 총 페이지 갯수 설정
					var pageSize = 10;	// 한번에 선택 가능한 페이지 갯수
					var startPage = Math.floor((page-1)/pageSize)*pageSize + 1;
					// 현재 페이지에서 이동할 수 있는 페이지를 보여주는 단위
					// 여기서는 한번에 10페이지씩 보여주려 한다.
					// 1~10사이의 페이지에서는 1~10페이지 사이의 페이지로 이동가능
					var endPage = startPage + (pageSize-1);
					if(endPage>totalPage) {	// 예 20 > 17
						endPage = totalPage;
						// 총 페이지가 20 30 이런게 아니라 14 16 24 이런식일때
						// 해당 페이지를 마지막 페이지로 설정
					}
					var max = count - ((page-1)*size);	// 글번호 구하기
					var datas = {
						page : page,
						begin : begin,
						size : size,
						totalPage : totalPage,
						pageSize : pageSize,
						startPage : startPage,
						endPage : endPage,
						max : max
					};

					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

// 회원목록 불러오기
var getList = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = "SELECT email, birth, CASE WHEN sex='1' THEN '남' WHEN sex='2' THEN '여' END AS sex, CASE WHEN ban='1' THEN '차단' ELSE '' END AS ban, IFNULL(ban_date, '') AS banDate, DATE_FORMAT(register_date, '%Y-%c-%d') AS regDate, CASE WHEN del='1' THEN '탈퇴' ELSE '' END AS del FROM member ORDER BY email ASC, del ASC LIMIT ?, ?";
			conn.query(sql, [datas.begin, datas.size], function (err, list) {
				if(err) {
					var error = 'getList_error';
					conn.release();
					callback(err, error);
				} else {
					// query 성공
					datas.list = list;

					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

// 모든 회원목록 불러오기
exports.wMemList = function (page, callback) {
	async.waterfall([
		function (callback) {
			memberCount(page, callback);
		}, function (datas, callback) {
			getList(datas, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}