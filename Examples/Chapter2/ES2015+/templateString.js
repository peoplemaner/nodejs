var num1 = 1;
var num2 = 2;
var result = 3;
var string1 = num1 + ' 더하기 ' + num2 + '는 \'' + result + '\'';
console.log(string1); // 1 더하기 2는 '3'

const num3 = 1;
const num4 = 2;
const result2 = 3;
const string2 = `${num3} 더하기 ${num4}는 '${result2}'`;
console.log(string1); // 1 더하기 2는 '3'

/**
 * string1은 띄어쓰기와 변수, 더하기 기호와 작은따옴표를 이스케이프(escape)하느라 가독성이 좋지 않음.
 */