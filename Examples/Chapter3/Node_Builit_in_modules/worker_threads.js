const {
    Worker, isMainThread, parentPort
} = require('worker_threads');

if (isMainThread) { // 부모일 때
    /* 다중 Woker 생성
    let workers = [];
    for ( let i = 0; i < 4; i++) {
        var worker = new Worker(__filename);  // 현재 파일을 워커 스레드에서 실행
        console.log(worker.threadId);
        worker.on('message', message => console.log('from worker', message));   // 워커로부터 온 postMessage;
        worker.on('exit', () => console.log('worker exit'));
        worker.postMessage('ping'); // 해당 워커로 ping 전송
        workers.push(worker);
    }*/
    const worker = new Worker(__filename);  // 현재 파일을 워커 스레드에서 실행
    console.log(worker.threadId);
    worker.on('message', message => console.log('from worker', message));   // 워커로부터 온 postMessage;
    worker.on('exit', () => console.log('worker exit'));
    worker.postMessage('ping'); // 해당 워커로 ping 전송*/
} else {    // 워커일 때
    // 워커 스레드에서 실행 되는 영역
    parentPort.on('message', (value) => {   // 부모에서 온 postMessage
        console.log('from parent', value);
        parentPort.postMessage('pong'); // 부모 스레드로 pong 전송
        parentPort.close();
    });
}

// 차후 멀티 worker http 서버 + socket 서버 테스트 프로젝트 