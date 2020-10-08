const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });    // 클라이언트가 접속할 path 설정

    app.set('io', io);  // 라우터에서 io 개체를 app.get('io')로 쓸수 있게 저장

    const room = io.of('/room');
    const chat = io.of('/chat');

    io.use((socket, next) => {  // io에 미들웨어 장착, 웹 소켓 연결 시마다 실행
        cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);  // express-session에 connect.sid 세션 쿠키 설정
        sessionMiddleware(socket.request, socket.request.res, next); // socket.request 개체 안에 socket.request.session 개체가 생성
    });

    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });

    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        const { headers: { referer } } = req;
        const roomId = referer
                        .split('/')[referer.split('/').length - 1]
                        .replace(/\?.+/, '');
        socket.join(roomId);    // 방 들어가기

        // 특정 방에 join 메세지 broadcasting
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`
        })

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');

            socket.leave(roomId);   // 방에서 나오기
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;
            if (userCount === 0) {  // userCount가 0인 경우 방 삭제
                //axios.delete(`http://localhost:8005/room/${roomId}`)
                const signedCookie = req.signedCookies['connect.sid'];
                const connectSID = cookie.sign(signedCookie, process.env.COOKIE_SECRET);
                axios.delete(`http://localhost:8005/room/${roomId}`, {
                    headers: {
                        Cookie: `connect.sid=s%3A${connectSID}`
                    }
                })
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                // 특정 방에 exit 메세지 broadcasting
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`
                });
            }
        });
    });
};

/**
 * io.of(네임스페이스명) : Socket.IO는 기본적으로 / 네임스페이스에 접속하지만, of()메서드를 사용해 다른 네임스페이스를 생성 가능.
 * 네임스페이스는 지정된 네임스페이스에 연결한 클라이언트들에게만 데이터 전달.
 * 
 * Socket.IO > 네임스페이스 > 방
 * Socket.IO에는 네임스페이스보다 더 세부적인 개념으로 방(room)이 있음.
 * 같은 네임스페이스 안에서도 같은 방에 들어있는 소켓끼리만 데이터를 주고받을 수 있음.
 * join()과 leave()는 방 아이디를 인수를 받고 socket.request.headers.referer를 통해 
 * 현재 웹 페이지의 URL을 가져올 수 있고, split과 replace를 사용해 방 아이디를 추출.
 * 
 * axios 요청 시에 요청자가 누구인지에 대한 정보가 없음.
 * express-session에서는 세션 쿠키인 req.signedCookies['connect.sid']를 보고 누구인지 판단.
 * 브라우저에서는 자동으로 보내지만 서버에서 axios요청을 보낼 때는 쿠키를 보내지 않음.
 * 따라서 express-session이 판단할 수 있게 요청 헤더에 직접 세션 쿠키를 넣어야 함.
 * io 개체에 cookie-parser를 연결 후 axios 요청을 보낼 때 connect.sid를 직접 설정
 * 쿠키 암호화를 위해 cookie-signatrue 패키지도 설치.
 * 
 * 특정인에게 메시지 보내기 : socket.to(소켓 아이디).emit(이벤트, 데이터);
 * 나를 제외한 모두에게 메시지 보내기 : socket.broadcast.emit(이벤트, 데이터), socket.broadcast.to(방 아이디).emit(이벤트, 데이터);
 */