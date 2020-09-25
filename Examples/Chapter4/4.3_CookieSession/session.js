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

const session = {};

http.createServer(async (req, res) => {
    const cookies = parseCookie(req.headers.cookie);
    
    console.log("cookies==");
    console.log(cookies); // undefined?
    if (req.url.startsWith('/login')) { // login 성공 한 경우 쿠키에 세션 넣어서 응답
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);

        const uniqueInt = Date.now();
        session[uniqueInt] = {
            name, expires
        };

        res.writeHead(302, { 
            Location: '/', 
            'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`
        });
        res.end();
    } else if (cookies && cookies.session && session[cookies.session].expires > new Date()) {   // 세션 쿠키가 존재하고, 만료 기간이 지나지 않았다면
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8'});
        res.end(`${session[cookies.session].name}님 안녕하세요`);
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
 * 세션 아이디는 꼭 쿠키를 사용하지 않아도 되나 쿠키 사용방식이 간단하여 많은 웹 사이트가 쿠키 세션방식을 사용.
 * 실제 배포용 서버에서는 세션은 위와 같이 변수로 저장하지 않음. 서버가 멈추거나 재시작되면 메모리에 저장된
 * 변수가 초기화되기도 하고 서버 메모리가 부족하면 저장 못하는 문제도 발생함.
 * 그래서 보통은 레디스(Redis)나 멤캐시드(Memcached)같은 데이터베이스에 넣어 둠.
 * 
 * 위 예제는 개념을 설명하기 위한 예제이며 보안상 매우 취약함. 실 서비스에 적용해서는 안됨.
 * 실 서비스에서는 보안 등 검증된 모듈을 사용.
 */