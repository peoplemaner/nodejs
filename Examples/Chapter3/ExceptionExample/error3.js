const fs = require('fs/promises');

setInterval(() => {
    fs.unlink('./abcd.js')
}, 1000);

/**
 * 프로미스 에러는 알아서 처리 되나(프로세스 종료 되지 않음) 항상 catch를 붙여주는 것을 권장
 */