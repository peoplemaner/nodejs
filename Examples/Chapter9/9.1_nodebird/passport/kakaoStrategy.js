const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' }});
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao'
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }))
}

/**
 * 카카오 로그인 전략
 * clientID : 카카오에서 발급해주는 앱 할당 아이디(노출되면 안되므로 process.env.KAKAO_ID로 설정)
 * callbackURL : 인증 결과 콜백(라우터에 작성)
 * 카카오에서 인증 후 callbackURL에 적힌 주소로 accessToken, refreshToken과 profile을 보냄.
 * profile에 있는 사용자 정보로 유저 생성
 */