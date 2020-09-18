const fs = require('fs/promises');

fs.copyFile(`${__dirname}/writeFile.txt`, `${__dirname}/writeFile3.txt`)
    .then(() => {
        console.log('복사 완료');
    })
    .catch((error) => {
        console.error(error);
    });

/**
 * 노드 8.5버전 이후에는 createReadStream, createWriteStream을 pipe 대신 copyFile사용
 */