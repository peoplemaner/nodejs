const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

//.env 파일 읽어 오기
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const { sequelize } = require('./models/index');
const passportConfig = require('./passport/index');

const app = express();
passportConfig();

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

/**
 * sequelize 데이터 베이스 생성
 * config.json development json의 database명 수정
 * 터미널에서 npx sequelize db:create 명령 실행
 *   > Loaded configuration file "config\config.json".
 *   > Using environment "development".
 *   > Database nodebird created.
 * sequelize model에서 DB 스키마를 정의해놓고 서버를 실행하면
 * 테이블 쿼리에 IF NOT EXISTS 생성 쿼리를 넣어서 테이블도 자동 생성하게 됨.
 * 생성 쿼리 각 모듈.js 참조
 */

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((error) => {
        console.error(error);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
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
app.use(passport.initialize()); // 요청(req 개체)에 passport 설정
app.use(passport.session());    // req.session 개체에 passport 정보 저장, passport 미들웨어는 express-session 미들웨어 보다 뒤에 연결

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', po)

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.locals.message = error.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? error : {};
    res.status(error.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'port Server listening');
});