const zlib = require('zlib');
const fs = require('fs');

const readStream = fs.createReadStream(`${__dirname}/read.txt`);
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream(`${__dirname}/read.txt.gz`);
readStream.pipe(zlibStream).pipe(writeStream);

/**
 * zlib createGzip 메서드가 스트림을 지원하여 readStream과 writeStream중간에서 파이핑 가능.
 * 버퍼 데이터가 전달되다가 gzip압축을 거친 후 파일로 써짐.
 */