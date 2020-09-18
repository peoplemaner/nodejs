const crypto = require('crypto');

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt:', salt);
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password:', key.toString('base64'));
    });
});

/**
 * sha512 변환된 결괏값을 다시 sha512로 10만 번 반복.
 * 1초 정도 걸리고 너무 느리거나 빠르면 반복 횟수를 조정.
 * crypto.randomBytes와 crypto.pbkdf2메서드는 내부적으로 스레드풀을 사용해 멀티 스레딩으로 동작(블로킹 없음).
 * 최초 salt 값을 저장 해놓고 crypto.pbkdf2에 입력하여 사용.
 */