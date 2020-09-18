const os = require('os');

console.log('운영체제 정보---------------------');
console.log('os.arch():', os.arch());
console.log('os.platform():', os.platform());
console.log('os.type():', os.type());           //os 종류
console.log('os.uptime():', os.uptime());       //os 부팅 후 흐른 시간(초)
console.log('os.hostname():', os.hostname());   //컴퓨터 이름
console.log('os.release():', os.release());     //운영체제 버전

console.log('경로-----------------------------');
console.log('os.homedir():', os.homedir());
console.log('os.tmpdir():', os.tmpdir());

console.log('cpu 정보-------------------------');
console.log('os.cpus():', os.cpus());
console.log('os.cpus():', os.cpus().length);

console.log('memory 정보----------------------');
console.log('os.freemem():', os.freemem());
console.log('os.totalmem():', os.totalmem());