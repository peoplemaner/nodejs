/**
 * 쿠키 : 사용자(해당 브라우저) 식별
 * 서버에서 로그인 성공 시 쿠키에 식별자를 넣어 전달.
 * 이후 브라우저에서는 요청 때마다 쿠키를 넣어 전달하여(브라우저에서 자동으로 전달) 서버가 식별 하게 됨.
 */

const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, { 'Set-Cookie': 'mycookie=test'});
    res.end('Hello Cookie');
}).listen(8080, () => {
    console.log('8080 Server Listening');
});

/**
 * / undefined
 * /favicon.ico mycookie=test
 * favicon은 브라우저 상단 탭 이미지
 * 브라우저에서는 HTML에서 파비콘을 찾지 못하면 /favicon.ico 요청을 보냄.
 */