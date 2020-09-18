/**
 * 양방향 암호화
 * 사용 알고리즘은 aes-256-cbc, aes-256-cbc 알고리즘은 key가 32바이트, iv 16바이트여야 함.
 */

 const crypto = require('crypto');

 const algorithm = 'aes-256-cbc';
 const key = 'abcdefghijklmnopqrstuvwxyz123456';
 const iv = '1234567890123456';

 const cipher = crypto.createCipheriv(algorithm, key, iv);
 let result = cipher.update('암호화할 문자', 'utf8', 'base64');
 result += cipher.final('base64');
 console.log('암호화:', result);

 const decipher = crypto.createDecipheriv(algorithm, key, iv);
 let result2 = decipher.update(result, 'base64', 'utf8');   // 인코딩은 cipher와 역순으로 입력
 result2 += decipher.final('utf8');
 console.log('복호화:', result2);