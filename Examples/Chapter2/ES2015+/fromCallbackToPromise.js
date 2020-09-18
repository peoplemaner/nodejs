function findAndSaveUser(Users) {
    Users.findOne({}, (error, user) => {    // 첫번째 콜백
        if (error) return console.error(error);

        user.name = 'zero';
        user.save((error) => {  // 두번째 콜백
            if(error) return console.error(error);
            Users.findOne( { gender: 'm' }, (error, user) => {  // 세번째 콜백

            });
        });
    })
}

// 콜백 함수가 세 번 중첩, 콜백 함수가 나올 때마다 코드가 깊어지고 콜백 함수마다 에러도 따로 처리해줘야 함.

findAndSaveUser2 = (Users) => {
    Users.findOne({})
        .then((user) => {
            user.name = 'zero';
            return user.save();
        })
        .then((user) => {
            return Users.findOne( { gender: 'm' } );
        })
        .then((user) => {

        })
        .catch((error) => {
            console.error(error);
        });
}

// 예제 코드는 findeOne과 save메서드가 내부적으로 프로미스 객체를 가지고 있다는 가정해야 가능
// 지원하지 않는 경우 콜백 함수를 프로미스로 바꿀 수 있는 방법은 3.5.6절

const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
Promise.all([promise1, promise2])
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });

// 여러 프로미스를 한번에 실행하는 방법