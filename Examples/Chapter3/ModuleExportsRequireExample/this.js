console.log(this);
console.log(this === module.exports);
console.log(this === exports);
whatIsThis = () => {
    console.log('function', this === exports, this === global);
}
whatIsThis();

/**
 * 최상위 스코프에서 this는 module.exports(또는 exports 객체)를 참조
 * 함수 선언문 내부 this는 global 객체를 참조
 */