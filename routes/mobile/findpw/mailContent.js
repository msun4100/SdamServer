// mailContent.js

var mailContent = function (tempPw) {
	var content ="<b><div align='center'><table border='0' cellpadding='0' cellspacing='0' width='540' style='border: 1px solid black; font-family: Nanum Gothic, 나눔 고딕, 맑은 고딕, Helvetica, Malgun Gothic, sans-serif, Arial; background-color: #fff;'><tbody><tr><td style='font-size:15pt; color:#000000; margin-left: 20px;' height='40' valign='middle'><table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%'><div><img src='54.65.142.202/images/logo.png' width='100%' height='50%'></div><div style='margin-left: 20px; margin-top: 10px; line-height: 1.5em;'>안녕하세요!<br>오늘을 담다, 쓰담입니다.<br><br>임시 비밀번호 :<div style='font-size: 35pt; color: #6689E8; margin-top: 15px;'><strong>" + tempPw + "</strong></div><div style='margin-top: 15px; margin-bottom: 20px;'>로그인 후 비밀번호를 변경해주시기 바랍니다.</div></div></table></td></tr><tr><td style='font-size: 10pt; color: #A4A4A4; line-height: 1.2em; padding: 10px; border-top: 1px solid lightgray'>이 편지는 발신전용입니다.<br>문의사항이 있으신 경우 App의 문의하기를 이용해주시기 바랍니다.<br>쓰담 <a href='http://sdam.strikingly.com/'>http://sdam.strikingly.com/</a></td></tr></tbody></table></div></b>";
	return content;
}

module.exports = mailContent;