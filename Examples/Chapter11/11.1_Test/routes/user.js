const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controllers/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollowing);

module.exports = router;

/**
 * 팔로잉 관계가 생겼으므로 req.user에도 팔로워와 팔로잉 목록 추가
 * (deserializeUser 수정)
 */