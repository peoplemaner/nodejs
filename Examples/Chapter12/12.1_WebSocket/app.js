const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const webSocket = require('./socket');
const indexRouter = require('./routes/index');

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

webSocket(server);
/**
 * 웹 소켓(WS)은 익스프레스(HTTP)와 같은 포트 공유 가능.
 * Socket.IO는 웹 소켓을 발전 시킨 라이브러리.
 * IE9처럼 웹 소켓을 지원하지 않는 브라우저는 Socket.IO을 이용하여 해결
 * 
 * 
 * 웹 소켓은 HTML5에 새로 추가된 스펙으로 실시간 양방향 데이터 전송을 위한 기술.
 * HTTP와 다르게 WS라는 프로토콜 사용, 최신 브라우저는 대부분 웹 소켓을 지원하고 노드에서는 ws나 Socket.IO 패키지 사용.
 * 웹 소켓이 나오기 전에는 HTTP기술을 사용하여 실시간 데이터 전송을 구현, 
 * 그 중 하나가 폴링(polling) 방식(Client가 Server로 지속적으로 업데이트 여부를 확인)
 * 
 * 폴링(HTTP, 단방향(Client > Server)), 웹 소켓(Socket.IO, 양방향), 서버센트 이벤트(Server Sent Event, 단방향(Server > Client))
 */


