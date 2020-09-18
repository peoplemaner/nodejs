/**
 * ES2015부터 지원, 자바스크립트와 노드 API들이 콜백 대신 프로미스 기반으로 재구성 됨.
 * 콜백 지옥 현상을 극복했다는 평가를 받음.
 */

const condition = false;
const promise = new Promise((resolve, reject) => {
    if (condition) resolve('성공');
    else reject('실패');
});
// new Promise((then 콜백 함수, error 콜백 함수) => { });

promise.then((message) => {
    console.log(message);   // 성공(resolve)한 경우 실행
}).catch((error) => {
    console.error(error);   // 실패(reject)한 경우 실행
}).finally(() => {
    console.log('무조건');
});

const isSuccess = true;
const promise2 = new Promise((success, error) => {
    if(isSuccess) success('promise2 성공');
    else error('에러');
});

promise2.then((message) => {
    return new Promise((success, error) => {
        success('새로운 프로미스1 성공');
        //error('새로운 프로미스1 에러');
    });
}).then((message2) => {
    console.log(message2);
    return new Promise((success, error) => {
        success('새로운 프로미스2 성공');
        //error('새로운 프로미스2 에러');
    });
})
.then((message3) => { console.log(message3);})
.catch((error) => { console.log(error);});