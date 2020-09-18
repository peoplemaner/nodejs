/**
 * 비동기 메서드 들은 백그라운드에서 실행되며 동시에 처리 됨.
 * 이는 스레드 풀이 있기 때문.
 * fs 외에도 내부적으로 스레드풀을 사용하는 모듈로는 crypto, zlib, dns.lookup 등이 있음.
 */

const crypto = require('crypto');

const pass = 'pass';
const salt = 'salt';
const start = Date.now();

crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('1:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('2:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('3:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('4:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('5:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('6:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('7:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
    console.log('8:', Date.now() - start);
});

/**
 * 스레드풀을 사용하여 실행할 때마다 시간과 순서가 달라지며 어느 것이 먼저 처리될지 모름.
 * 1~4와 5~8이 그룹으로 묶여 있고, 5~8이 시간이 더 소요되는 것을 볼 수 있는데
 * 이는 기본적인 스레드풀 개수가 4개이기 때문.
 * 
 * 스레드풀 개수 조절
 * 윈도 : SET UV_THREADPOOL_SIZE=1, 리눅스: UV_THREADPOOL_SIXE=1 으로 설정.
 */