const multer = require('multer');
const path = require('path');

/**
 * multer 설정 
 * storage 속성에 어디(destination)에 어떤 이름(filename)으로 저장할 지 설정.
 * 크기 제한 5MB
 */
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 시스템 시작 시 폴더 생성
const fs = require('fs');

try {
    fs.readdirSync(`${__dirname}/uploads`);
} catch (error) {
    console.error('uploads 폴더가 없어 uploads폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/multipart.html'));
});

// single
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    /*
    {
        fieldname: 'image',
        originalname: '제목 없음.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'uploads/',
        filename: '제목 없음1600749332247.png',
        path: 'uploads\\제목 없음1600749332247.png',
        size: 5035
    } [Object: null prototype] 
    { title: 'test' }
    */
    res.send('ok');
});

// Multiple
app.post('/uploadMultiple', upload.array('multiple'), (req, res) => {
    console.log(req.files, req.body);
    res.send('multiple ok');
});

// Multiple2
app.post('/upload2', upload.fields([{ name: 'image1'}, { name: 'image2' }]), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});

app.listen(3000, () => {
    console.log("3000 Server Listening");
});
