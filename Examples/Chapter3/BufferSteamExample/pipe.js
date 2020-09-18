const fs = require('fs');

const readStream = fs.createReadStream(`${__dirname}/pipe2.txt`);
const writeStream = fs.createWriteStream(`${__dirname}/pipe1.txt`);

readStream.pipe(writeStream);

readStream.on('end', () => {
    console.log('옮기기 완료');

    const buffer = [];
    const confirmReadStream = fs.createReadStream(`${__dirname}/pipe1.txt`);
    confirmReadStream.on('data', (chunk) => {
        buffer.push(chunk);
    });
    confirmReadStream.on('end', () => {
        console.log(Buffer.concat(buffer).toString());
    });
});

/**
 * pipe2.txt 내용과 같은 파일 pipe1.txt를 생성.
 * 읽기 스트림과 쓰기 스트림 생성 후 pipe로 연결하면 데이터가 writeStream으로 전달 됨.
 * 따로 on('data')나 writeStream.write를 하지않아도 됨.
 * 노드 8.5 버전이 나오기 전까지 이 방식이 파일 복사 방식.
 */