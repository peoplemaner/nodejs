const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Good, Auction, User } = require('../models');
const { isLoggedin, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user; // 모든 응답에 user정보를 넣음.
    next();
});

// 메인 화면 렌더링
router.get('/', async (req, res, next) => {
    try {
        const goods = await Good.findAll({ where: { SoldId: null }});   // 경매 상품 전체 조회 (낙찰자가 null인 경우 경매 진행 중인 상품)
        res.render('main', {
            title: 'NodeAuction',
            goods
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 회원가입 화면 렌더링
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction'
    });
});

// 상품 등록 화면 렌더링
router.get('/good', isLoggedin, (req, res) => {
    res.render('good', { title: '상품 등록 - NodeAuction' });
});

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 상품 등록 처리
router.post('/good', isLoggedin, upload.single('img'), async (req, res, next) => {
    try {
        const { name, price } = req.body;
        await Good.create({
            OwnerId: req.user.id,   // passport에서 req에 user정보를 넣어줘서 가능
            name,
            img: req.file.filename,
            price
        });
        res.redirect('/');  // 따로 페이지 없음. redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;