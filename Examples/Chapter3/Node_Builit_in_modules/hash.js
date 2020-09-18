/**
 * 단방향 암호화(해시 함수)
 * 보통 비밀번호는 단방향 암호화하여 저장.
 * 단방향 암호화는 복호화가 불가능 하기 때문에 보안성을 높임.
 * 입력받은 비밀번호를 같은 알고리즘으로 암호화 한뒤 비교.
 */
const crypto = require('crypto');

console.log('base64:', crypto.createHash('sha512').update('비밀번호').digest('base64'));
console.log('hex:', crypto.createHash('sha512').update('비밀번호').digest('hex'));
console.log('base64:', crypto.createHash('sha512').update('다른 비밀번호').digest('base64'));

// createHash(알고리즘) : 사용할 해시 알고리즘 입력, md5, sha1, sha256, sha512등이 가능하지만, md5와 sha1은 취약점이 발견되어 보통 sha512를 사용.
// update(문자열) : 변환할 문자열 입력
// digest(인코딩) : 인코딩할 알고리즘 입력. 주로 base64, hex, latin1이 사용되는데, 그 중 base64 결과가 가장 짧아 주로 사용 됨.
// 현재는 주로 pdkd2나 bcrypt, scrypt 알고리즘으로 비밀번호 암호화 하고 있음. 그 중 노드에서 지원하는 pdkdf2를 예제로 알아 봄.