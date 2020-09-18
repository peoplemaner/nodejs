var sayNode = function() {
    console.log('Node');
};
var es = 'ES';
var oldObject = {
    sayJS: function() {
        console.log('JS');
    },
    sayNode: sayNode
};
oldObject[es + 6] = 'Fantastic';
oldObject.sayNode();    // Node
oldObject.sayJS();  // JS
console.log(oldObject.ES6); // Fantastic

const newObject = {
    sayJS() {
        console.log('JS');
    },
    sayNode,
    [es + 6]: 'Fantastic'
};
newObject.sayNode();
newObject.sayJS();
console.log(newObject.ES6);

/**
 * es + 6과 같은 속성명을 동적으로 생성 가능하도록 변경.
 * sayNode 처럼 속성명과 변수명이 동일한 경우 한번만 써도 되도록 변경.
 * 코드 중복을 피하는 편의 제공.
 */
const name = 'ad';
const age = 3;
const oldO = { name: name, age: age };
const newO = { name, age };
console.log(oldO.name, newO.name);