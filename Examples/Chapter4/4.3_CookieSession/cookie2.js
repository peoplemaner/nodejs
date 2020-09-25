const http = require('http');
const fs = require('fs/promises');
const url = require('url');
const qs = require('querystring');

const parseCookie = (cookie = '') => {
    cookie.split(';')
        .map(v => v.split('='))
            .reduce((acc, [k, v]) => {
                acc[k.trim()] = decodeURIComponent(v);

                console.log(`reduce : ${acc.name}`);
                return acc;
            }, {});
}

http.createServer(async (req, res) => {
    const cookies = parseCookie(req.headers.cookie);
    
    console.log("cookies==");
    console.log(cookies); // undefined?
    if (req.url.startsWith('/login')) { // login 성공 한 경우 쿠키 넣어서 응답
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, { 
            Location: '/', 
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`
        });
        res.end();
    } else if (cookies && cookies.name) {   // 쿠키가 있고 name이 있다면 로그인 성공 응답
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8'});
        res.end(`${cookies.name}님 안녕하세요`);
    } else {    // 쿠키가 없는 경우 login페이지 응답
        try {
            const data = await fs.readFile(`${__dirname}/cookie2.html`);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
            res.end(data);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8'});
            res.end(error.message);
        }
    }
}).listen(8080, () => {
    console.log('8080 Server Listening');
});

/**
 * Set-Cookie 설정 옵션
 * 쿠키명=쿠키값
 * Expires=날짜 : 만료 기한. 기본값은 클라이언트 종료 시
 * Max-age=초 : Expires와 비슷하지만 날짜 대신 초 입력. Expires보다 우선 순위 높음.
 * Domain=도메인명 : 쿠키가 전송될 도메인을 특정. 기본값은 현재 도메인
 * Path=URL : 쿠키가 전송될 URL 특정. 기본값 '/'이고, 이 경우 모든 URL에서 쿠키 전송
 * Secure: HTTPS일 경우에만 쿠키 전송
 * HttpOnly: 설정 시 자바스크립트에서 쿠키에 접근할 수 없음. 쿠키 조작 방지.
 */