const http = require('http');
const fs = require('fs/promises');

const users = {}; // 데이터 저장용

http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        if (req.method === 'GET') {
            if (req.url === '/') {
                const data = await fs.readFile(`${__dirname}/restFront.html`);
                res.writeHead(200, { 'Content-Type': 'text/html; charser=utf-8'});
                return res.end(data);
            } else if (req.url === '/about') {
                const data = await fs.readFile(`${__dirname}/about.html`);
                res.writeHead(200, { 'Content-Type': 'text/html; charser=utf-8'});
                return res.end(data);
            } else if (req.url === '/users') {
                res.writeHead(200, { 'Content-Type': 'text/html; charser=utf-8'});
                return res.end(JSON.stringify(users));
            }

            try {
                const data = await fs.readFile(`${__dirname}/${req.url}`);
                return res.end(data);
            } catch (error) {

            }
        } else if (req.method === 'POST') {
            if (req.url === '/user') {
                let body = '';
                // 요청의 body를 stream형식으로 받음
                req.on('data', (data) => {
                    body += data;
                });
                // 요청 body를 다 받은 후 실행
                return req.on('end', () => {
                    console.log('본문 :', body);
                    const { name } = JSON.parse(body);
                    const id = Date.now();
                    users[id] = name;
                    res.writeHead(201);
                    res.end('등록 성공');
                });
            }
        } else if (req.method === 'PUT') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                // 요청의 body를 stream형식으로 받음
                req.on('data', (data) => {
                    body += data;
                });
                // 요청 body를 다 받은 후 실행
                return req.on('end', () => {
                    console.log('본문 :', body);
                    users[key] = JSON.parse(body).name;
                    res.end(JSON.stringify(users));
                });
            }
        } else if (req.method === 'DELETE') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key];
                return res.end(JSON.stringify(users));
            }
        }
        res.writeHead(404);
        return res.end('NOT FOUND');
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8'});
        res.end(error.message);
    }
}).listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다');
});

/**
 * POST와 PUT은 req와 res가 내부적으로 스트림을 사용하므로 on('data'), on('end')를
 * 사용하여 데이터를 받는다. 그리고 전송받은 데이터는 문자열 이므로 JSON.parse를 하여 사용한다.
 */