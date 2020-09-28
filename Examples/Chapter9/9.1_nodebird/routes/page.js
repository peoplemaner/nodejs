const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

// 처음 이 미들웨어를 거치면서 모든 템플릿 엔진에서 사용할 locals 값을 설정
router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followers.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird'});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird'});
});

router.get('/', (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick']
            },
            order: [['createdAt', 'DESC']]
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query }});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ inclust: { model: User }});
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;

/**
 * route/middleware에서 참조한 isLoggedIn, isNotLoggedIn 미들웨어를 추가 시킴으로써
 * profile, join 라우터에 대한 로그인 검증을 추가
 * 이와 같은 방식으로 팔로잉 여부, 관리자 여부등의 미들웨어 추가 가능.
 * 
 * res.locals.user = req.user; -> 넌적스에서 user 데이터 접근이 가능해짐.
 */