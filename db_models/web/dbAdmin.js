// dbAdmin.js

// DB 설정 정보를 만들어두고 이를 참조하도록 한다
var mysql = require('mysql');

var dbAdmin = {
	connectionLimit: 5,
	host: 'sdamdbinstance.cllw05blonpw.ap-northeast-2.rds.amazonaws.com',
	user: 'root',	// root
	password: 'k2561489K',	// test : 1119, officail : ssdam
	database: 'sdam'
};

// pool 변수에 connection에 쓸 mysql Pool 값을 저장
var pool = mysql.createPool(dbAdmin);

module.exports = pool;