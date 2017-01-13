var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 스케쥴러
var schedule = require('node-schedule');
// 회원 정보 삭제 DB작업
var db = require('./db_models/deleteMember');

// 매일 새벽 4시에 회원 삭제작업 진행
var rule = new schedule.RecurrenceRule();
rule.hour = 4;
rule.minute = 0;

// 스케쥴 작업
var j = schedule.scheduleJob(rule, function(){
    db.deleteMember(function (result) {
        if(result === 'DB_connection_error') {
            console.log('err : cannot delete member data, DB_connection_error');
        } else if (result === 'deleteMember_error') {
            console.log('err : cannot delete member data, deleteMember_error');
        } else if (result === true) {
            console.log('deleteMember Schedule done successfully');
        }
    });
});


// https 사용 설정
var https = require('https');   // https 사용
var fs = require('fs'); // ssl key 파일 읽어오기 위해 사용

var session = require('express-session');   // session 사용

var routes = require('./routes/index');

// mobile
// 기능별로 js 파일 분리
// 해당 파일 위치를 변수에 저장
var register = require('./routes/mobile/register/register');
var findpw = require('./routes/mobile/findpw/findpw');
// var emailSend = require('./routes/mobile/register/emailSend');
// var emailAuth = require('./routes/mobile/register/emailAuth');

var login = require('./routes/mobile/login/login');

var around = require('./routes/mobile/list/around');
var issue = require('./routes/mobile/list/issue');
var news = require('./routes/mobile/list/news');

var read = require('./routes/mobile/read/read');
var readNotice = require('./routes/mobile/read/readNotice');

var article = require('./routes/mobile/write/article');
var reply = require('./routes/mobile/write/reply');

var categorySearch = require('./routes/mobile/search/categorySearch');
var contentSearch = require('./routes/mobile/search/contentSearch');

var good = require('./routes/mobile/good/good');
var cancelgood = require('./routes/mobile/good/cancelgood');
var goodreply = require('./routes/mobile/good/goodreply');
var cancelgreply = require('./routes/mobile/good/cancelgreply');

var report = require('./routes/mobile/report/report');
var reportreply = require('./routes/mobile/report/reportreply');

var aban = require('./routes/mobile/ban/aban');
var wban = require('./routes/mobile/ban/wban');

var delarticle = require('./routes/mobile/delete/delarticle');
var delreply = require('./routes/mobile/delete/delreply');

var mylist = require('./routes/mobile/my/mylist');
var myhide = require('./routes/mobile/my/myhide');
var myfavor = require('./routes/mobile/my/myfavor');
var myemotion = require('./routes/mobile/my/myemotion');
var myday = require('./routes/mobile/my/myday');
var mycalendar = require('./routes/mobile/my/mycalendar');

var invite = require('./routes/mobile/invite/invite');
var set = require('./routes/mobile/set/set');
var changepw = require('./routes/mobile/set/changepw');
var checkinfo = require('./routes/mobile/set/checkInfo');
var withdraw = require('./routes/mobile/withdraw/withdraw');
var distance = require('./routes/mobile/distance/distance');

var exit = require('./routes/mobile/exit/exit');



// web
var wRegister = require('./routes/web/register/wRegister');
var wLogin = require('./routes/web/login/wLogin');

var wList = require('./routes/web/list/wList');
var wNotice = require('./routes/web/list/wNotice');

var wRead = require('./routes/web/read/wRead');

var wReply = require('./routes/web/write/wReply');
var wNWrite = require('./routes/web/write/wNWrite');
var wArticle = require('./routes/web/write/wArticle');

var wMemList = require('./routes/web/list/wMemList');

var app = express();


// windows에서는 utf8 빼면 buffer 형태로 읽어서 오류발생
var options = {
    key : fs.readFileSync('./ssl/key.pem', 'utf8'), // private key 위치 설정
    cert : fs.readFileSync('./ssl/ssdam.crt', 'utf8')   // public key 위치 설정
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session 옵션
// cookieparser 보다 아래에 위치
app.use(session({
    secret : 'I love her but she doesnt love me',   // session 암호화
    resave : false,
    saveUninitialized : true
}));

app.use('/', routes);


// mobile
// 분리한 모듈 url 주소에 따른 위치 전달
// GET 방식은 처음 url만 쓰고 나머지 부분은 해당 파일에 써주고
// req.params.해당이름 으로 값을 받는다.
app.use('/register', register);
app.use('/findpw', findpw);
// app.use('/emailsend', emailSend);
// app.use('/emailauth', emailAuth);

app.use('/login', login);

app.use('/around', around);
app.use('/issue', issue);
app.use('/new', news);

app.use('/read', read);
app.use('/readNotice', readNotice);

app.use('/article', article);
app.use('/reply', reply);

app.use('/categorySearch', categorySearch);
app.use('/contentSearch', contentSearch);

app.use('/good', good);
app.use('/cancelgood', cancelgood);
app.use('/goodreply', goodreply);
app.use('/cancelgreply', cancelgreply);

app.use('/report', report);
app.use('/reportreply', reportreply);

app.use('/aban', aban);
app.use('/wban', wban);

app.use('/delarticle', delarticle);
app.use('/delreply', delreply);

app.use('/mylist', mylist);
app.use('/myhide', myhide);
app.use('/myfavor', myfavor);
app.use('/myemotion', myemotion);
app.use('/myday', myday);
app.use('/mycalendar', mycalendar);

app.use('/invite', invite);
app.use('/set', set);
app.use('/checkinfo', checkinfo);
app.use('/changepw', changepw);
app.use('/distance', distance);
app.use('/withdraw', withdraw);

app.use('/exit', exit);


// web
app.use('/wRegister', wRegister);
app.use('/wLogin', wLogin);

app.use('/wList', wList);
app.use('/wNotice', wNotice);

app.use('/wRead', wRead);

app.use('/wReply', wReply);
app.use('/wNWrite', wNWrite);
app.use('/wArticle', wArticle);

app.use('/wMemList', wMemList);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// catch 500 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Internal Server Error');
    err.status = 500;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// https 서버 실행
var port2 = 443;
https.createServer(options, app).listen(port2, function () {
    console.log('SDAM https 서버가 ' + port2 + '에서 실행 중 입니다.');
});


// http 서버 실행
app.set('port', process.env.PORT || 3000);
// 포트번호 변경 80
// 포트번호 설정, process.env.PORT를 쓰는데 없으면 3000
var server = app.listen(app.get('port'), function() {
    console.log('SDAM http 서버가 ' + server.address().port + '에서 실행 중 입니다.');
});


module.exports = app;