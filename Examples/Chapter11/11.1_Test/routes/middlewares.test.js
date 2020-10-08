test('2 + 1은 2입니다.', () => {
    expect(2 + 1).toEqual(2);
});

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
// middlewares를 테스트 하기 위해선 req개체 isAuthenticated 메서드, res개체 status, send, redirect가 필요함.
// 가짜 개체와 함수를 만들어서 넣음(모킹).
// 함수 모킹: jest.fn 메서드, 반환값이 있는 경우 jest.fn(() => 반환값)

describe('isLoggedIn', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    };
    const next = jest.fn();

    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true)
        };
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false)
        };
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
});

describe('isNotLoggedIn', () => {
    const res = {
        redirect: jest.fn()
    };
    const next = jest.fn();

    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true)
        };
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });

    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false)
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});