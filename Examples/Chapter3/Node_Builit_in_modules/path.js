/**
 * 폴더와 파일 경로 관련 모듈
 * 크게 윈도우 타입과 POSIX 타입으로 구분
 * 윈도우 : C:\Users\ZeroCho   '\'로 구분
 * POSIX (유닉스 기반, 맥, 리눅스) : /home/zerocho '/'로 구분 
 */

 const path = require('path');

 const string = __filename;

 console.log('path.sep:', path.sep);                        // 경로 구분자
 console.log('path.delimiter:', path.delimiter);            // 환경변수 구분자
 console.log('-----------------------------------');
 console.log('path.dirname():', path.dirname(string));      // 파일 경로
 console.log('path.extname():', path.extname(string));      // 파일 확장자
 console.log('path.basename():', path.basename(string));    // 파일 이름(확장자 포함)
 console.log('path.basename - extname:', path.basename(string, path.extname(string))); // 파일 이름(확장자 제외)
 console.log('-----------------------------------');
 console.log('path.parse():', path.parse(string));          // 파일 경로를 root, dir, base, ext, name으로 분리
 console.log('path.format():', path.format({
     dir: 'C:\\users\\zerocho',
     name: 'path',
     ext: '.js'
 }));
 console.log('path.normalize():', path.normalize('C://users\\\\zerocho\\\path.js'));    // /나 \를 실수로 여러 번 사용했거나 혼용했을 때 정상적인 경로로 변환.
 console.log('-----------------------------------');
 console.log('path.isAbsolute(C:\\):', path.isAbsolute('C:\\'));        // 파일 경로가 절대경로인지 상대경로인지 true, false로 반환
 console.log('path.isAbsolute(./home):', path.isAbsolute('./home'));    // 파일 경로가 절대경로인지 상대경로인지 true, false로 반환

 console.log('-----------------------------------');
 console.log('path.relative():', path.relative('C:\\users\\zerocho\\path.js', 'C:\\')); //첫번째 경로에서 두번째 경로로 가는 방법 반환
 console.log('path.join():', path.join(__dirname, '..', '..', '/users', '.', '/zerocho'));  // 여러 인수를 넣으면 하나의 경로로 합침. 상대경로인 ..(부모), .(현 위치)도 알아서 처리
 console.log('path.resolve():', path.resolve(__dirname, '..', '..', '/users', '.', '/zerocho')); // join()과 비슷하지만 /가 입력되면 절대경로로 인식함.
