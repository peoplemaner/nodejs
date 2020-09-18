const A = require('./globalA');

global.message = '안녕하세요';
console.log(A());

/**
 * global 전역 객체
 * globalB에서 global.message에 대입한 '안녕하세요'를 globalA의 global.message에서도 공유 예제.
 *  */ 