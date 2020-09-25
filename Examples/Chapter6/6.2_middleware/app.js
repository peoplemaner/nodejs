const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'session-cookie'
}));

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        morgan('combined')(req, res, next);
    } else {
        morgan('dev')(req, res, next);
    }
});

app.use((req, res, next) => {
    console.log(req.sessionID);
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
// 미들웨어 여러개 장착, next()를 해야 다음으로 넘어감.
app.get('/', (req, res, next) => {
    console.log('GET / 요청에 다 실행됩니다.');
    next();
}, (req, res) => {
    console.log(req.session);
    res.send('d');
    //throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

/**
 * 자주 사용하는 미들웨어
 * npm i morgan cookie-parser express-session dotenv
 * 
 * app.use(morgan('dev')) : 요청과 응답에 대한 정보를 콘솔에 기록,
 *  GET / 500 11.825 ms - 50 ( HTTP메서드, 주소, HTTP상태 코드, 응답 속도, 응답 바이트)
 *  인수로 dev외에 combined, common, short, tiny 등, 주로 개발 환경에서는 dev, 배포 환경에서는 combined 사용
 * 
 * app.use('/', express.static(path.join(__dirname, 'public'))) : 정적 파일들을 제공하는 라우터 역할, express 기본 제공
 *  인수로 정적 파일들이 담겨 있는 폴더 지정.
 *  ex) public/stylesheets/style.css는 http://loclahost:3000/stylesheets/style.css로 접근.
 *      css나 js, 이미지 파일들을 public 폴더에 넣으면 브라우저에서 접근 가능.
 *  정적 파일들을 알아서 제공해주므로 fs.readFile로 직접 읽어서 전송할 필요가 없음.
 *  만약 해당 경로에 파일이 없으면 알아서 내부적으로 next를 호출, 파일을 발견했다면 응답(다음 미들웨어 진행 안됨).
 * 
 * body-parser
 *  app.use(express.json()); app.use(express.unlencoded({ extened: false }));
 *  body-parser는 Express 4.16.0버전부터 일부 기능이 내장되어 따로 설치할 필요가 없음.
 *  만약 요청이 Raw(버퍼 데이터), Text(텍스트 데이터)인 경우에는 body-parser를 설치 후 
 *  const bodyParser = require('body-parser);
 *  app.use(bodyParser.raw()); app.use(bodyParser.text()); 추가
 *  
 * 요청 데이터 종류
 *  JSON은 JSON형식 데이터 전달, URL-encoded는 주소 형식으로 데이터를 보내는 방식.
 *  폼 전송은 URL-encoded방식을 주로 사용, urlencoded메서드에서 extened 옵션은 false이면 
 *  노드의 querystring모듈을 사용, true면 qs 모듈을 사용하여 쿼리스트링을 해석.
 * 
 * 이전에 POST와 PUT이 스트림을 사용해 데이터를 전달 받아야 햇으나 body-parser를 사용하면 내부적으로 스트림 처리해 req.body에 추가 해줌.
 *  ex) { name: 'zerocho', book: 'nodejs' }를 보낸다면 req.body에 그대로 들어감.
 *      URL-encoded 형식으로 name=zerocho&boo=nodejs를 보낸다면 req.body에 { name: 'zerocho', book: 'nodejs' }가 들어감.
 * 
 * cookie-parser
 *  app.use(cookieParser(비밀키));
 *  요청에 동봉된 쿠키를 해석해 req.coodies 개체로 만들며 유효기간이 지난 쿠키는 걸러 냄.
 *  첫번째 인수는 비밀 키. 서명된 쿠키가 있는 경우 제공한 비밀 키를 통해 내 서버가 만든 쿠키임을 검증.
 *  쿠키는 위조가 쉬우므로 비밀 키를 통해 만들어낸 서명을 쿠키 값 뒤에 붙임, 
 *  서명이 붙으면 name=zerocho.sign 형식이 되며 req.cookies 대신 req.singedCoodies개체에 위치 함.
 *  cookie-parser는 생성기가 아님.
 * // 생성
 *  res.cookie('name', 'zerocho', {
 *      expires: new Date(Date.now() + 900000),
 *      httpOnly: true,
 *      secure: true
 *  });
 * // 삭제
 *  res.clearCookie('name', 'zerocho', { httpOnly: true, secure: true });
 *  삭제 시 쿠키의 옵션이 모두 동일해야 삭제 됨.
 *  옵션 singed는 true로 설정하면 쿠키 뒤에 서명이 붙음. 내 서버가 만들었다는 것이 검증가능하므로 켜놓는 것이 좋음.
 *  서명을 위한 비밀키는 cookieParser 미들웨어에 인수로 넣은 process.env.COOKIE_SECRET이 됨.
 * 
 * express-session
 *  세션 관리용 미들웨어, 로그인 등의 이유로 세션을 구현하거나 특정 사용자의 데이터를 임시적으로 저장해둘 때 매우 유용.
 *  세션은 사용자 별로 req.session 개체 안에 유지 됨.
 *  express-session 1.5 버전 이하는 cookie-parser 사용하여 보다 뒤에 위치해야 했으나 1.5버전 이후로는 사용하지 않아
 *  순서 상관이 없어짐.
 *  옵션
 *      resave : 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정.
 *      saveUninitialized : 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정.
 *  세션 관리 시 클라이언트에 쿠키를 보냄(세션 쿠키)
 *  쿠키를 안전하게 전송하려면 서명을 추가해야 하고, 서명하는데 secret 값이 필요함. 보통 cookie-parser의 secret과 같게 설정.
 *  세션 쿠키 이름은 name옵션으로 설정 기본값은 connect.sid
 *  cookie 옵션에서 httpOnly:true는 클라이언트에서 쿠키 확인하지 못하도록 설정, secure는 true면 https, false면 http
 * 
 *  store 옵션 : 예제에서는 메모리에 세션을 저장하도록 되어 있지만 이 데이터는 재시작 시 초기화 되어 모든 세션이 사라지게 됨.
 *      따라서 배포 시에는 store에 데이터베이스를 연결하여 세션을 유지하는 것이 좋음(주로 Redis 사용).
 * 
 *  요청 간 데이터 공유는 req. 에 넣어서 공유
 *  세션 유지 간 데이터 공유는 req.session에 저장
 */