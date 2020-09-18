const fs = require('fs');

fs.watch(`${__dirname}/target.txt`, (eventType, fileName) => {
    console.log(eventType, fileName);
});

/**
 * 내용 수정 시에는 change 이벤트 발생, 파일명을 변경하거나 파일을 삭제하면 rename 이벤트가 발생
 * rename 이벤트 발생한 후에는 더 이상 watch가 수행되지 않음.
 * change 이벤트는 두번씩 발생 되므로 주의 필요.
 */