// dbConfig.js

// DB 설정 정보를 만들어두고 이를 참조하도록 한다
var mysql = require('mysql');

var dbConfig = {
	connectionLimit: 250,
	host: 'sdamdbinstance.cllw05blonpw.ap-northeast-2.rds.amazonaws.com',	// 127.0.0.1
	user: 'root',	// root
	password: 'k2561489K',	// 1119
	database: 'sdam'
};

// pool 변수에 connection에 쓸 mysql Pool 값을 저장
var pool = mysql.createPool(dbConfig);

module.exports = pool;
