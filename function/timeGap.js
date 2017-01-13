// 시간 계산 모듈화
// 결과값인덱스 또는 증감변수, 필요한 값을 가진 배열(동시에 반환하는 배열)
function timeGap (i, result) {	// 시간차이 반환
	// result 값 넣을 데이타 배열
	// value 쿼리한 시간 UNIX_TIMESTAMP 값

	// UNIX_TIMESTAMP 형태는 초로 변환한 시간 값, 이를 이용하여 시간차이 계산

	// time 배열에서 시간값만 빼내어 저장
	var time = result[i].postTime;
	// 현재시간도 UNIX_TIMESTAMP 로 구함, 소수점 아래 버림
	var today = Math.floor(Date.now() / 1000);

	// 현재시간 - time 하면 차이값 초로 반환
	time = today - time;

	// 분, 시간, 일 단위에 따라 반환되는 값 다르게 한다.
	if( (time / 60) < 1 ) {	// time을 60으로 나누면 분 단위, 1분 미만
		time = 0;	// 1분 미만은 0
		result[i].time_unit = 'second';
		result[i].time_value = 0;
	} else if( (time / 60) >= 1 && (time / 60) < 60 ) {	// 1분 이상 60분 미만
		time = Math.floor( (time / 60) );	// 분단위로 반환, 초단위 소수점 값 버림
		result[i].time_unit = 'minutes';
		result[i].time_value = time;
	} else if ( (time / 60 / 60) >=1 && (time / 60 / 60) < 24 ) {	// 60분 이상 24시간 미만
		time = Math.floor( (time/60) / 60 );	// 시간 단위로 반환, 분단위 소수점값 버림
		result[i].time_unit = 'hours';
		result[i].time_value = time;
	} else if ( (time / 60 / 60 / 24) >=1 && (time / 60 / 60 / 24) < 30) {	// 1일 이상 30일 미만
		time = Math.floor( (time/60) / 60 / 24 );	// 일 단위로 반환, 시간단위 소수점값 버림
		result[i].time_unit = 'dates';
		result[i].time_value = time;
	} else if(( time / 60 / 60 / 24 / 30) >=1) { // 1달 이상
		time = Math.floor( (time/60) / 60 / 24 /30 );	// 개월 단위로 반환, 일단위 소수점값 버림
		result[i].time_unit = 'months';
		result[i].time_value = time;
	} else if(( time / 60 / 60 / 24 / 30 / 12) >=1) {
		time = Math.floor( (time/60) / 60 / 24 /30 / 12 );	// 년 단위로 변환, 개월0단위 소수점값 버림
		result[i].time_unit = 'years';
		result[i].time_value = time;
	}

	return null;
}

module.exports = timeGap;