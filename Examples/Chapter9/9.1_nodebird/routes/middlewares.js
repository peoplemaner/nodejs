// 로그인 검증 미들웨어

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
}

/**
 * Passport가 req 개체에 isAuthenticated 메서드를 추가
 * true 로그인 상태, false 로그인 안한 상태
 * 로그아웃 라우터나 이미지 업로드 라우터 등은 로그인한 유저만 접근할 수 있게 해야 하고,
 * 회원가입 라우터나 로그인 라우터는 로그인하지 않은 사람만 접근할 수 있게 해야 함.
 * 이런 경우 라우터에 로그인 여부를 검사하는 미들웨어를 넣어 걸러낼 수 있음. => routes/page.js
 */