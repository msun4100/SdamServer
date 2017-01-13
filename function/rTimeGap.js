// rTimeGap.js

function rTimeGap (value) {
	// 시간정보 담을 임시 배열
	timeArr = [];

	// 현재시간을 UNIX_TIMESTAMP 로 구함, 소수점 아래 버림, 한번만 저장하면 되므로 반복문 밖에서 선언
	var today = Math.floor(Date.now() / 1000);

	for(i = 0; i < value.length; i++) {
	// 결과 배열에서 시간값만 빼내어 저장
		timeArr[i] = value[i].rTime;

		// UNIX_TIMESTAMP 형태는 초로 변환한 시간 값, 이를 이용하여 시간차이 계산
		timeArr[i] = today - timeArr[i];

		// 분, 시간, 일 단위에 따라 반환되는 값 다르게 한다.
		if( (timeArr[i] / 60) < 1 ) {	// timeArr[i]을 60으로 나누면 분 단위, 1분 미만
			timeArr[i] = 0;	// 1분 미만은 0
			value[i].time_unit = 'second';
			value[i].time_value = 0;
		} else if( (timeArr[i] / 60) >= 1 && (timeArr[i] / 60) < 60 ) {	// 1분 이상 60분 미만
			timeArr[i] = Math.floor( (timeArr[i] / 60) );	// 분단위로 반환, 초단위 소수점 값 버림
			value[i].time_unit = 'minutes';
			value[i].time_value = timeArr[i];
		} else if ( (timeArr[i] / 60 / 60) >=1 && (timeArr[i] / 60 / 60) < 24 ) {	// 60분 이상 24시간 미만
			timeArr[i] = Math.floor( (timeArr[i]/60) / 60 );	// 시간 단위로 반환, 분단위 소수점값 버림
			value[i].time_unit = 'hours';
			value[i].time_value = timeArr[i];
		} else if ( (timeArr[i] / 60 / 60 / 24) >=1 && (timeArr[i] / 60 / 60 / 24) < 30) {	// 1일 이상 30일 미만
			timeArr[i] = Math.floor( (timeArr[i]/60) / 60 / 24 );	// 일 단위로 반환, 시간단위 소수점값 버림
			value[i].time_unit = 'dates';
			value[i].time_value = timeArr[i];
		} else if(( timeArr[i] / 60 / 60 / 24 / 30) >=1) { // 1달 이상
			timeArr[i] = Math.floor( (timeArr[i]/60) / 60 / 24 /30 );	// 개월 단위로 반환, 일단위 소수점값 버림
			value[i].time_unit = 'months';
			value[i].time_value = timeArr[i];
		} else if(( timeArr[i] / 60 / 60 / 24 / 30 / 12) >=1) {
			timeArr[i] = Math.floor( (timeArr[i]/60) / 60 / 24 /30 / 12 );	// 년 단위로 변환, 개월0단위 소수점값 버림
			value[i].time_unit = 'years';
			value[i].time_value = timeArr[i];
		}
	}

	return null;
}

module.exports = rTimeGap;