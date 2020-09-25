const express = require('express');
const path = require('path');   // html 전송 시 필요

const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    //res.send('Hello, Express');
    //HTML 응답
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

/**
 * Express 내부에 http 모듈이 내장되어 있어 서버 역할 가능.
 * app.set('port', 포트)를 사용하여 값 저장, app.get('port')로 조회 가능
 * app.get(주소, 라우터) : 주소에 대한 GET 요청이 올 때 어떤 동작을 하는지 적는 부분.
 *  express에서는 res.write()나 res.end() 대신 res.send()를 사용.
 * GET 요청 외에도 POST, PUT, PATCH, DELETE, OPTIONS에 대한 라우터를 위한
 *  app.postm app.put 등이 존재.
 * 
 * 실행 : npm start
 */