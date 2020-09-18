const fs = require('fs');

setInterval(() => {
    fs.unlink('./abc.js', (error) => {
        if (error) console.error(error);
    });
}, 1000);

/**
 * 내장 모듈 에러는 실행 중인 프로세스를 종료되지 않음.
 * 그러나 throw는 try/catch 하지 않으면 프로세스가 종료됨.
 */