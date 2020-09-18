if (true) {
    var x = 3;
}
console.log(x); // 3

if (true) {
    const y = 3;
}
console.log(y); // Uncaught ReferenceError : y is not defined

const a = 0;
a = 1; // Uncaught TypeError: Assignment to constant variable.

let b = 0;
b = 1; // 1

const c; // Uncaught SyntacError: Missing initializer in const declaration
/**
 * const, let과 var은 스코프 종류가 다름
 * var은 함수 스코프를 가지므로 if 블록과 관계없이 접근 가능
 * const와 let은 블록 스코프를 가지므로 블록 밖에서는 접근 불가능
 * const는 상수(초기화 시 값 할당 해야 함), let은 변수
 * 사용 : 변수 선언 시 기본적으로 const 사용, 다른 값을 할당해야 하는 경우 let을 사용
 */