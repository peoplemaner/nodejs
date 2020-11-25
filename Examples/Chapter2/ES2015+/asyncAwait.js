/**
 * node 7.6 버전부터 지원 ES2017에서 추가
 * 노드처럼 비동기 위주 프로그래밍에 적합
 * 프로미스가 콜백 지옥을 해결했다지만 then과 catch의 반복으로 코드가 여전히 장황함.
 * async/await 문법은 간략하게 개선
 */

async function findAndSaveUser(Users) {
    try {
        let user = await Users.findOne({});
        user.name = 'zero';
        user = await user.save();
        user = await Users.findOne({ gender: 'm'});
    } catch (error) {
        console.error(error);
    }
}

/**
 * 함수 async function으로 선언, promise 앞에 await
 * 해당 프로미스가 resolve될 때까지 기다린 뒤 다음 로직으로 진행
 * try catch로 에러 처리
 */

// 화살표 함수 async
const findAndSaveUser = async (Users) => {
    try {
        let user = await Users.findOne({});
        user.name = 'zero';
        user = await user.save();
        user = await Users.findOne({ gender: 'm'});
    } catch (error) {
        console.error(error);
    }
}

// for문과 async/await를 사용하여 프로미스를 순차적으로 실행 node 10버전 ES2018문법
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
    for await (promise of [promise1, promise2])
        console.log(promise);
})();

// async 함수 반환값은 항상 Promise로 감싸짐, 따라서 then 사용 가능
async function findAndSaveUser2(Users) {

}
findAndSaveUser2.then(() => { });
// or
async function other() {
    const result = await findAndSaveUser2();
}
//&&&&&&&&&&&&&&&&&&&&&&