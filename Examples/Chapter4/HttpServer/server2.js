const http = require('http');
const fs = require('fs/promises');

http.createServer(async (req, res) => {
    try {
        const data = await fs.readFile(`${__dirname}/server2.html`);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(data);  // 버퍼 데이터 전송
    } catch (error) {
        console.error(error);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(error.message);
    }
}).listen(8081, () => {
    console.log('8081번 포트에서 서버 대기 중입니다.');
});

/**
 * HTTP 상태 코드
 * 2XX : 성공. 200(성공), 201(작성됨)
 * 3XX : 리다이렉션(다른 페이지로 이동), 어떤 주소를 입력했는데 다른 주소의 페이지로 넘어갈 때 3XX 코드 사용.
 *      301(영구 이동), 302(임시 이동), 304(수정되지 않음, 요청의 응답으로 캐시를 사용했다는 뜻)
 * 4XX : 요청 오류(요청 자체 오류), 400(잘못된 요청), 401(권한 없음), 403(금지됨), 404(찾을 수 없음)
 * 5XX : 서버 오류, 요청은 제대로 왔지만 서버에 오류가 생겼을 때 발생.
 *      500(내부 서버 오류), 502(불량 게이트웨이), 503(서비스를 사용할 수 없음)
 */