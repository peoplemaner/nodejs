jest.mock('../models/user');
const User = require('../models/user');
const { addFollowing } = require('./user');

describe('addFollowing', () => {
    const req = {
        user: { id: 1 },
        params: { id: 2 }
    };
    const res = {
        status: jest.fn(() => res),
        send:jest.fn()
    };
    const next = jest.fn();

    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        User.findOne.mockReturnValue(Promise.resolve({
            addFollowing(id) {
                return Promise.resolve(true);
            }
        }));
        await addFollowing(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async () => {
        User.findOne.mockReturnValue(null);
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });

    test('DB에서 에러가 발생하면 next(error) 호출함', async () => {
        const error = '테스트용 에러';
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});

/**
 * 1. routes/user.js에서 미들웨어 분리 후 작성
 * 2. req, res, next 모킹하여 controllers/user.addFollowing 호출
 *  => Error (User.findOne 메서드, User Model 문제)
 * 3. User Model 모킹 ( User.findOne() => User.findOne.mockReturnValue() )
 */