const fs = require('fs');

console.log('before: ', process.memoryUsage().rss);

const readStream = fs.createReadStream(`${__dirname}/big.txt`);
const writeStream = fs.createWriteStream(`${__dirname}/big3.txt`);

readStream.pipe(writeStream);
readStream.on('end', () => {
    console.log('stream: ', process.memoryUsage().rss);
});
/**
 * before:  19365888
 * stream:  55197696
 * sync 방식이 1GB 사용했던 것과 비교하여 확연히 줄어듬. 1GB > 55MB
 * stream방식으로 큰 파일을 조각내어 작은 버퍼 단위로 옮겼기 때문.
 */