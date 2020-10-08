const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email }});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}

/**
 * 로그인 전략 구현. passport-local 모듈에서 Strategy생성자를 불러와 그 안에 전략 구현.
 * new LocalStrategy
 *  - 첫번째 인수 : 전략에 관한 설정, usernameField와 passwordField에는 각각에 맞는 req.body 파라미터를 적어줌.
 *  - 두번째 인수 : 실제 전략 수행 async함수, 첫번째 인수에서 usernameField > email, passwordField > password로 전달 됨, done은 passport.authenticate의 콜백 함수.
 * 
 * done() 콜백 메서드
 *  - 첫번째 인수 : 서버에서 에러가 발생한 경우 사용
 *  - 두번째 인수 : 사용자 정보 전달
 *  - 세번째 인수 : 로그인 처리 과정에서 사용자 정의 에러가 발생했을 때 사용
 *  * routes/auth.js 로그인 라우터 passport.authenticate('local', callback) 콜백 함수로 전달.
 */