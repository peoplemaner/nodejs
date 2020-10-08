const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = require('./page');

const route = express.Router();

// img 저장 폴더 확인
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads폴더를 생성합니다.');
    fs.mkdir('uploads', {}, (error) => {
        console.error(error);
    });
}

// single multer 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 이미지 업로드
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});
/**
 * 하나 업로드 받은 뒤 이미지 저장 경로를 클라이언트로 응답(static 미들웨어가 /img 경로의 정적 파일을 제공)
 */

const upload2 = multer();

// 게시글 업로드
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {    // 형식이 multipart이지만, 이미지 데이터가 들어있지 않으므로 none 메서드 사용
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,  //  이전 라우터에서 이미지 업로드 했다면 이미지 주소가 req.body.url로 전송됨
            UserId: req.user.id
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g);   // 해시태그를 정규표현식으로 추출
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({   // 저장 시 findOrCreate메서드 사용하여 없으면 생성 있으면 가져옴.
                        where: { title: tag.slice(1).toLowerCase() /* 해시태그에서 #을 떼고 소문자로 바꿈 */ }
                    })  
                })
            );
            await post.addHashtags(result.map(r => r[0]));  // 결과 값으로 [모델, 생성 여부]를 반환하므로 r[0]으로 모델(생성된 해시태그)만 게시글과 연결.
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
/**
 * 현재 multer 패키지는 이미지를 서버 디스크에 저장.
 * 디스크에 저장하면 간단하긴 하지만, 서버에 문제가 생겼을 때 이미지가 제공되지 않거나 손실 될 수 있음.
 * 따라서 AWS S3나 클라우드 스토리지(Cloud Storage) 같은 정적 파일 제공 서비스를 사용하여 이미지를 따로 저장하고 제공하는 것이 좋음.
 * 이러한 서비스를 이용하고 싶다면 multer-s3나 multer-google-storage 패키지 사용.
 */

module.exports = router;