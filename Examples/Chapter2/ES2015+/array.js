var array = ['nodejs', {}, 10, true];
var node = array[0];
var obj = array[1];
var bool = array[3];

const [node2, obj2, number, boolean] = array;

console.log(node2);
console.log(obj2);
console.log(number);
console.log(boolean);
console.log('구조분해할당');