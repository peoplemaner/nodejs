const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    }); // 로그인 시 실행, req.session(세션) 개체에 어떤 데이터를 저장할지 정하는 메서드, 두번째 인수에 저장하고 싶은 데이터 입력

    passport.deserializeUser((id, done) => {
        User.findOne({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers'
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings'
            }]
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    }); // 매 요청 시 실행, passport.session 미들웨어가 호출, serializeUser done의 두번째 인수가 deserializeUser의 매개변수가 됨.
    //  id로 User를 조회한 정보를 req.user에 저장하므로 req.user를 통해 로그인한 사용자 정보를 조회할 수 있음.

    local();
    kakao();
};

/**
 * passport 실행 과정(로그인)
 * 1. 라우터를 통해 로그인 요청이 들어옴.
 * 2. 라우터에서 passport.authenticate 메서드 호출
 * 3. 로그인 전략 수행
 * 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
 * 5. req.login 메서드가 passport.serializeUser 호출
 * 6. req.session에 사용자 아이디만 저장
 * 7. 로그인 완료
 * 
 * passport 실행 과정(로그인 이후)
 * 1. 요청이 들어옴
 * 2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser 메서드 호출
 * 3. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
 * 4. 조회된 사용자 정보를 req.user에 저장
 * 5. 라우터에서 req.user 객체 사용 가능
 * 
 * localStrategy와 kakaoStrategy 파일은 각각 로컬 로그인과 카카오 로그인 전략에 대한 파일.
 * 로그인 동작을 전략이라고 표현
 * 
 * 로컬 로그인 구현 - routes/middlewares.js
 * 카카오 로그인 구현 - passport/kakaoStrategy.js
 * 
 * deserializeUser 캐싱하기
 *  - 라우터가 실행되기 전에 deserializeuser가 먼저 실행됨, 따라서 모든 요청이 들어올 때마다 매번 사용자 정보를 조회하게 됨.
 *  이는 곧 요청이 많이 들어오게 되면 데이터베이스에 큰 부담이 주어짐, 사용자 정보가 빈번하게 바뀌는 것이 아니라면 캐싱을 해두는
 *  것이 좋음. 실제 서비스에서는 메모리에 캐싱하기 보다는 레디스 같은 데이터베이스에 사용자 정보를 캐싱.
 */