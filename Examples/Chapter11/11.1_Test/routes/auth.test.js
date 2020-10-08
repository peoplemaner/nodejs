const request = require('supertest');
const { sequelize } = require('../models/index');
const app = require('../app');

// supertest 메서드 테스트 시작 시 실행
beforeAll(async () => {
    await sequelize.sync();
});

// 회원 가입 테스트
describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'zerocho@gmail.com',
                nick: 'zerocho',
                password: 'nodejsbook'
            })
            .expect('Location', '/')
            .expect(302, done);
    });
});

// 로그인 상태에서 회원가입 시도 테스트
describe('POST /join', () => {
    // agent로 요청 객체를 담아 놓고 beforeEach를 이용해 먼저 로그인
    // 이후 회원 가입 요청 테스트

    const agent = request.agent(app);   // 요청 재사용 가능
    // supertest 메서드 각각의 테스트 실행에 앞서 제일 먼저 실행되는 부분.
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'zerocho@gmail.com',
                password: 'nodejsbook'
            })
            .end(done);
    });

    test('이미 로그인했으면 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: 'zerocho@gmail.com',
                nick: 'zerocho',
                password: 'nodejsbook'
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

// 로그인 테스트 
describe('POST /login', () => {
    test('가입되지 않은 회원', async (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'zeroch1@gmail.com',
                password: 'nodejsbook'
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

    test('비밀번호 틀림', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerocho@gmail.com',
                password: 'nod'
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

    test('로그인 수행', async (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerocho@gmail.com',
                password: 'nodejsbook'
            })
            .expect('Location', '/')
            .expect(302, done);
    });
});

// 로그아웃 테스트
describe('GET /logout', () => {
    test('로그인되어 있지 않으면 403', async (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'zerocho@gmail.com',
                password: 'nodejsbook'
            })
            .end(done);
    });

    test('로그아웃 수행', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        agent
            .get('/auth/logout')
            .expect('Location', `/`)
            .expect(302, done);
    });
});

/**
 * supertest 메서드 afterAll() 모든 테스트 종료 후 실행.
 * sequelize.sync({ force: true }); 으로 테이블 초기화
 */
afterAll(async () => {
    await sequelize.sync({ force: true });
});