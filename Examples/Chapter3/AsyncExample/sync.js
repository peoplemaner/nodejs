const fs = require('fs');

console.log('시작');
let data = fs.readFileSync(`${__dirname}/readme.txt`);
console.log('1번', data.toString());

data = fs.readFileSync(`${__dirname}/readme.txt`);
console.log('2번', data.toString());

data = fs.readFileSync(`${__dirname}/readme.txt`);
console.log('3번', data.toString());

console.log('끝');

/**
 * 순차적으로 read하도록 readFileSync를 사용.
 * 그러나 Sync 메서드는 이전 작업이 완료되어야 다음 작업을 진행.
 * 백그라운드가 작업하는 동안 메인 스레드는 아무것도 하지 못하는 대기 상태
 * 백그라운드는 fs작업을 동시에 처리할 수 있는데, Sync메서드를 사용하면 백그라운드조차 동시에 처리할 수 없게 됨.
 * 
 * 동기 메서드는 거의 사용하지 않음. 프로그램 처음 실행 시 초기화 용도로만 사용하는 것을 권장.
 */