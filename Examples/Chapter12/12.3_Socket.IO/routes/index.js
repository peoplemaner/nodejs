const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

// uploads 폴더 체크
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
// multer 설정
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
    limits: { fileSize: 5 * 1024 * 1024}
});

// 메인화면 렌더링, 채팅방 목록 조회
router.get('/', async (req, res, next) => {
    try {
        const rooms = await Room.find({}); // 전체 방 조회
        res.render('main', { rooms } );
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 채팅방 생성 페이지 렌더링
router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성'});
});

// 채팅방 생성
router.post('/room', async (req, res, next) => {
    try {
        const newRoom = await Room.create({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password
        }); // DB 데이터 생성 및 JSON 개체 반환

        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);    // 새로 생성된 방 네임스페이스 room에 Broadcasting
        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`); // router.get('/room/:id', async (req, res, next) => {}) 라우터로 redirect
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 채팅방 페이지 렌더링
router.get('/room/:id', async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');

        if (!room) {
            return res.redirect('/?error=존재하지 않는 방입니다.');
        }

        if (room.password && room.password !== req.query.password) {
            return res.redirect('/?error=비밀번호가 틀립니다.');
        }

        const { rooms } = io.of('/chat').adapter;   // 네임스페이스.adapter.rooms에 방 정보
        // rooms[req.params.id] : 해당 방 소켓 목록
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
            return res.redirect('/?error=허용 인원을 초과했습니다.');
        }
        const chats = await Chat.find({ room: room._id }).sort('createAt'); // 기존 채팅 내역 불러오기

        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.session.color
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 채팅방 삭제
router.delete('/room/:id', async (req, res, next) => {
    try {
        await Room.deleteOne({ _id: req.params.id });  // 방 내역 삭제
        await Chat.deleteMany({ room: req.params.id }); // 채팅 내역 삭제
        res.send('ok');
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);   // 2초 뒤 room 네임스페이스에 방 삭제 알림
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/room/:id/chat', async (req, res, next) => {
    try {
        const chat = await Chat.create({
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat
        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
    try {
        const chat = await Chat.create({
            room: req.params.id,
            user: req.session.color,
            gif: req.file.filename
        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;