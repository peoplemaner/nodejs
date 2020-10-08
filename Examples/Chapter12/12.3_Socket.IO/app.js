const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const ColorHash = require('color-hash');

dotenv.config();
const webSocket = require('./socket');
const indexRouter = require('./routes/index');
const connect = require('./schemas');

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});
connect();  // 몽고 디비 연결

// app.js와 socket.js 간에 express-session 미들웨어를 공유하기 위해 변수로 분리
// session 공유를 위해 express-session사용, websocket 메서드에 app, sessionMiddleware추가
const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

app.use((req, res, next) => {
    if (!req.session.color) {
        const colorHash = new ColorHash();
        req.session.color = colorHash.hex(req.sessionID);   // ColorHash는 입력값을 HEX형식의 색상 문자열로 바꿔주는 패키지, 사용자가 많아질 경우 색상 중복 가능성 있음.
        //req.session.color를 사용자 아이디처럼 사용
    }
    next();
});

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

webSocket(server, app, sessionMiddleware);
/**
 * 브라우저 Network 부분을 보면 연결 시 xhr(폴링) 방식이 존재.
 * Socket.IO는 먼저 폴링 방식으로 서버와 연결(클라이언트에서 http프로토콜 사용한 이유)
 * 폴링 연결 후, 웹 소켓을 사용할 수 있다면 웹 소켓으로 업그레이드, 웹 소켓을 지원하지 않는
 * 브라우저는 폴링 방식으로 변경!
 * 
 * 현재 구조상 사용자를 구분하기 위한 값은 socket.id는 페이지가 바뀔때마다 소켓을 새로 연결하기 때문에 
 * session 값을 사용.
 */