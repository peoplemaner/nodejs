const { odd, even } = require('./var');
const checkNumber = require('./func');

checkStringOddOrEven = (str) => {
    if (str.length % 2) {
        return odd;
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('hello'));

/**
 * Node.js 모듈
 * 각 파일을 모듈화 하여 파일 간의 참조 예제
 */