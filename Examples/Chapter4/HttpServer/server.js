const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
}).listen(8080, () => { // 서버 연결
    console.log('8080번 포트에서 서버 대기 중입니다!');
})

/**
 * 유명한 포트 번호 21(FTP), 80(HTTP), 443(HTTPS), 3306(MYSQL)
 * 리눅스와 맥에서는 1024번 이하 포트 연결할 때 관리자 권한이 필요함(명령어 앞에 sudo 사용).
 * 
 * res.writeHead : 헤더 셋팅, 200(응답코드), 콘텐츠 타입 html, 한글 표시를 위해 utf-8
 * res.write : 클라이언트로 보낼 데이터, 버퍼 전송도 가능
 * res.end : 인수가 있다면 그 내용까지 보내고 응답을 종료.
 */