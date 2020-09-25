const https = require('https');
const fs = require('fs');

https.createServer({
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로')
    ]
}, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
}).listen(443, () => {
    console.log('443 Server Listening');
});

/**
 * createServer메서드에서 두 개의 인수를 받음.
 * 두번째 인수는 서버 로직이고, 첫번째 인수는 인증서 관련 옵션 개체.
 * 인증서를 구입하면 pem이나 crt, 또는 key확장자를 가진 파일들을 제공.
 * readFileSync로 cert, key, ca옵션에 맞게 넣으면 됨.
 * 
 * http2 모듈
 * SSL 암호화와 더불어 최신 HTTP프로토콜인 http/2를 사용.
 * http/1.1도 파이프라인 기술을 적용해서 그렇게 큰 차이는 나지 않은나,
 * http/2가 훨씬 효율적은 분명함.
 */