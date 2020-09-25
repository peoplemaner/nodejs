const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        console.log('code: ', code, ', signal: ', signal);
    });
} else {
    // 실제 서버 로직은 여기서 구현(각 워커들이 사용)
    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write('<h1>Hello Node!</h1>');
        res.end('<p>Hello Cluster!</p>');

        setTimeout(() => {  // 워커가 존재하는지 확인하기 위해 1초마다 강제 종료
            process.exit(1);
        }, 1000);
    }).listen(8080);

    console.log(`${process.pid}번 워커 실행`);
}

/**
 * cluster 모듈은 기본적으로 싱글 프로세스로 동작하는 노드가 CPU코어 모두 사용할 수 있게 해주는 모듈.
 * 포트를 공유하는 프로세스를 여러 개 생성하여, 많은 요청에 병렬로 실행된 서버 개수만큼 분산 처리.
 * 단점은 메모리를 공유 못함.
 * 세션을 메모리에 저장하는 경우 문제가 될 수 있음.
 * 이는 레디스 등의 서버를 도입하여 해결할 수 있음.
 * 
 * 직접 cluster모듈로 클러스터링을 구현할 수도 있지만, 실무에서는 pm2 등의 모듈로 cluster 기능을 사용.
 */