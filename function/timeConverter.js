// 시간 변환 함수
function timeConverter (UNIX_timestamp){
	// UnixTimestamo to MySQL datetime
	var a = new Date(UNIX_timestamp*1000);

	var year = a.getFullYear();
	var month = a.getMonth()+1;
	if(month < 10) {
		month = '0' + month;
	}
	var date = a.getDate();
	if(date < 10) {
		date = '0' + date;
	}
	var hour = a.getHours();
	if(hour < 10) {
		hour = '0' + hour;
	}
	var min = a.getMinutes();
	if(min < 10) {
		min = '0' + min;
	}
	var sec = a.getSeconds();
	if(sec < 10) {
		sec = '0' + sec;
	}
	var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
	return time;
}

module.exports = timeConverter;