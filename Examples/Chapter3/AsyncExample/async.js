const fs = require('fs');

console.log('시작');
fs.readFile(`${__dirname}/readme.txt`, (error, data) => {
    if (error) console.error(error);
    console.log('1번', data.toString());
});
fs.readFile(`${__dirname}/readme.txt`, (error, data) => {
    if (error) console.error(error);
    console.log('2번', data.toString());
});
fs.readFile(`${__dirname}/readme.txt`, (error, data) => {
    if (error) console.error(error);
    console.log('3번', data.toString());
});
console.log('끝');

/**
 * 시작
 * 끝
 * 2번 저를 읽어주세요.
 * 1번 저를 읽어주세요.
 * 3번 저를 읽어주세요.
 * 
 * 순서대로 읽히지 않음. => fs.readFile은 비동기 메서드
 * 비동기 메서드 동작 방식 : 백그라운드에 처리 요청 후 다음 단계로 넘어감.
 *                          나중에 작업 처리가 완료되면 백그라운드가 다시 메인 스레드에게 알림.
 *                          메인 스레드는 이때 등록된 콜백 함수를 실행.
 * 
 * 이러한 방식은 수백 개의 I/O 요청이 들어와도 메인 스레드는 백그라운드에 요청 처리를 위임함.
 * 백그라운드에서는 요청 세 개를 거의 동시에 실행함(3.6.4 스레드풀).
 * 
 * 동기-블로킹 방식: 메인 스레드가 백그라운드 작업 완료 여부를 계속 확인하며, 호출한 함수가 바로 return 되지 않고 백그라운드 작업이 끝나야 return 됨.
 * 비동기-논 블로킹 방식: 호출한 함수가 바로 return되어 다음 작업으로 넘어가며, 백그라운드 작업 완료 여부는 신경 쓰지 않고 나중에 백그라운드가 알림을 줄 때 처리.
 */

 