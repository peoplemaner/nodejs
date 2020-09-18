const dep1 = require('./dep1');
const dep2 = require('./dep2');

dep1();
dep2();

/**
 * require('./dep1')이 먼저 실행 > dep1.js에서 require('./dep2') 실행 > 다시 dep2.js에서 require('./dep1')이 실행.
 * ==> dep1의 module.exports 함수가 아니라 빈 객체로 표시. 이러한 현상을 순환 참조.
 * 순환 참조가 있을 경우 빈 객체로 변경되기 때문에 순환 참조가 발생하지 않도록 구조를 잘 잡는 것이 중요.
 */