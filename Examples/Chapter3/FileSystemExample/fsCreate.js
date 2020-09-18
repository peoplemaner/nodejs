/**
 * fs 기타 메서드
 */

const fs = require('fs/promises');
const constants = require('fs').constants;

fs.access(`${__dirname}/folder`, constants.F_OK | constants.W_OK | constants.R_OK)
    .then(() => {
        return Promise.reject('이미 폴더 있음');
    })
    .catch((error) => {
        if (error.code === 'ENOENT') {
            console.log('폴더 없음');
            return fs.mkdir(`${__dirname}/folder`);
        }
        return Promise.reject(error);
    })
    .then(() => {
        console.log('폴더 만들기 성공');
        return fs.open(`${__dirname}/folder/file.js`, 'w');
    })
    .then((fd) => {
        console.log('빈 파일 만들기 성공', fd);
        fs.rename(`${__dirname}/folder/file.js`, `${__dirname}/folder/newFile.js`);
    })
    .then(() => {
        console.log('이름 바꾸기 성공');
    })
    .catch((error) => {
        console.error(error);
    });

/**
 * fs.access(경로, 옵션, 콜백) : 폴더나 파일 접근할 수 있는지 체크, 두번째 인수로 상수들(constants) 넣어
 *                              권한 체크, 폴더나 파일이 없거나 권한이 없으면 에러가 발생하는데 ENOENT는 없을 때 에러 코드
 * fs.mkdir(경로, 콜백) : 이미 폴더 있으면 에러 발생, mkdir전에 access로 확인 먼저.
 * fs.open(경로, 옵션, 콜백) : 파일의 아이디(fd 변수)를 가져오는 메서드, 파일이 없다면 생성 후 아이디 반환
 *                          가져온 아이디를 통해 fs.read나 fs.write 가능, 두번째 인수는 w(write), r(read), a(add, 기존 파일에 추가)
 * fs.rename(기존 경로, 새 경로, 콜백) : 이름 바꾸는 기능, 꼭 같은 폴더 지정할 필요는 없으니 파일 이동도 가능.
 */