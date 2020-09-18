const fs = require('fs');

console.log('before: ', process.memoryUsage().rss);

const data1 = fs.readFileSync(`${__dirname}/big.txt`);
fs.writeFileSync(`${__dirname}/big2.txt`, data1);
console.log('buffer: ', process.memoryUsage().rss);

/**
 * before:  19488768
 * buffer:  1050136576
 * sync 메서드를 사용하여 1GB 메모리가 할당 됨.
 */