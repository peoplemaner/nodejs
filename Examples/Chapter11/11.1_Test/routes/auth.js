const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { authenticate } = require('passport');

const User = require('../models/user');

const router = express.Router();

// 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email }});
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
/**
 * 1. 같은 이메일로 가입한 사용자가 있는지 조회 
 *  - 있으면 회원가입 페이지로(주소 뒤에 에러를 쿼리스트링으로 표시)
 *  - 없으면 비밀번호 암호화 > 사용자 정보 생성
 *  * 비밀번호 암호화는 bcrypt사용, 두번째 인수는 암호화 반복 횟수(12 이상 추천, ~31까지 가능), promise를 지원하는 함수이므로 await 사용
 */

// 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내 미들웨어에는 (req, res, next)를 붙임.
});
/**
 * 1. passport.authenticate('local') 미들웨어가 로그인 전략 수행
 *  * 미들웨어 안 미들웨어, 미들웨어에 사용자 정의 기능을 추가하고 싶을 때 사용.
 * 2. 콜백 실행 됨.
 *  - authError가 있으면 실패, 두번재 매개변수가 있다면 성공
 * 3. req.login 메서드 호출(Passport는 req개체에 login, logout메서드를 추가함)
 * 4. req.login 메서드는 passport.serializeUser를 호출함.
 */

// 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
/**
 * req.logout 메서드는 req.user 개체를 제거하고, req.session.destroy는 req.session 개체를 제거
 * 세션 정보 제거 후 메인 페이지로 돌아감(로그인 해제 상태).
 */

router.get('/kakao', passport.authenticate('kakao'));
/**
 * kakao로그인 전략 실행, 처음에는 passport-kakao에서 자동으로 카카오 로그인 창으로 리다이렉트, 이후 로그인 성공 여부 결과를 
 * /kakao/callback으로 받고 다시 로그인 전략 실행
 * local 로그인과 다른 점은 passport.authenticate메서드에 콜백 함수를 제공하지 않음(Passport가 카카오 로그인 성공 시 내부적으로 req.login 호출).
 * 콜백 함수 대신 로그인 실패 시 어디로 이동할지를 failureRedirect에 적고 성공 시에도 어디로 이동할지를 다음 미들웨어에 입력
 */

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureredirect: '/' // 카카오 로그인 실패 시 redirect 경로
}), (req, res) => {
    res.redirect('/');  // 카카오 로그인 성공 시 redirect 경로
});

module.exports = router;

// app.js에서 연결할 때 /auth 접두사를 붙이므로 주소는 /auth/join, /auth/login, /auth/logout이 됨.