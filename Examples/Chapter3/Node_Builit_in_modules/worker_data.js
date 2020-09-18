const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

if (isMainThread) {
    const threads = new Set();
    threads.add(new Worker(__filename, {
        workerData: { start: 1 }
    }));
    threads.add(new Worker(__filename, {
        workerData: { start: 2 }
    }));

    for (let worker of threads) {
        worker.on('message', message => console.log('from worker', message));
        worker.on('exit', () => {   // worker에서 postMessage 전송함과 동시에 exit 호출 됨.
            threads.delete(worker);
            if (threads.size === 0) {
                console.log('job done');
            }
        });
    }
} else {
    const data = workerData;
    parentPort.postMessage(data.start + 100);
    
}