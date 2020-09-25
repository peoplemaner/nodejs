const mongoose = require('mongoose');

const connect = () => {
    // 개발 환경일 때만 콘솔을 통해 몽구스가 생성하는 쿼리 확인
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }

    mongoose.connect('mongodb://qorgh:1234@localhost:27017/admin', {
        dbName: 'nodejs',
        useNewUrlParser: true,
        useCreateIndex: true
    }, (error) => {
        if (error) {
            console.log('몽고디비 연결 에러', error);
        } else {
            console.log('몽고디비 연결 성공');
        }
    });
}

mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;
