const fs = require('fs');

const readStream = fs.createReadStream(`${__dirname}/read.txt`, { highWaterMark: 16 });  // highWatermark : 버퍼 크기 설정 (기본값 64byte)
const data = [];

readStream.on('data', (chunk) => {  // read.txt data가 16byte씩 나눠서 전송
    data.push(chunk);   
    console.log(chunk.toString());
    console.log('data :', chunk, chunk.length);
});

readStream.on('end', () => {
    console.log('end :', Buffer.concat(data).toString());
})

readStream.on('error', (error) => {
    console.log('error :', error);
});

/**
 * readStream은 이벤트 리스너 사용 data, end, error
 */