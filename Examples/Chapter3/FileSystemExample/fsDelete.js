const fs = require('fs/promises');

fs.readdir(`${__dirname}/folder`)
    .then((dir) => {
        console.log('폴더 내용 확인', dir);
        return fs.unlink(`${__dirname}/folder/newFile.js`);
    })
    .then(() => {
        console.log('파일 삭제 성공');
        return fs.rmdir(`${__dirname}/folder`);
    })
    .then(() => {
        console.log('폴더 삭제 성공');
    })
    .catch((error) => {
        console.error(error);
    })

/**
 * 파일 폴더 삭제
 * fs.readdir(경로, 콜백) : 폴더 안의 내용물 확인, 배열 안에 내부 파일(확장자 포함)과 폴더명
 * fs.unlink(경로, 콜백) : 파일 삭제, 파일 존재 확인 먼저
 * fs.rmdir(경로, 콜백) : 폴더 삭제, 내부 파일 모두 지우고 호출해야 함.
 */