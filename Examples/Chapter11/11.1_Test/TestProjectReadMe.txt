test 파일은 파일명과 확장자 사이에 test나 spec을 넣으면 됨.
실행은 npm test 실행하면 test나 spec이 들어간 파일들을 모두 찾아 실행.

1. 유닛 테스트
 - package.json scripts에 "test": "jest" 추가
 - routes/middlewares.test.js
 test('테스트 명', 실행할 함수);

 - npm test

결과)

 PASS  routes/middlewares.test.js
  √ 1 + 1은 2입니다. (3 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.533 s

 FAIL  routes/middlewares.test.js
  × 1 + 1은 2입니다. (6 ms)

  ● 1 + 1은 2입니다.

    expect(received).toEqual(expected) // deep equality

    Expected: 2
    Received: 3

      1 | test('1 + 1은 2입니다.', () => {
    > 2 |     expect(1 + 2).toEqual(2);
        |                   ^
      3 | });

      at Object.<anonymous> (routes/middlewares.test.js:2:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        2.717 s
Ran all test suites.
npm ERR! Test failed.  See above for more details.

2. 라우터에 연결되어 있는 미들웨어 테스트
 - routes/user.js에서 router.post('/:id/follow', async (req, res, next) => {}) 미들웨어 분리( => controllers/user.js)
 * model 모킹

3. 테스트 커버리지
 - package.json scripts에 "coverage": "jest --coverage" 추가
 - npm run coverage
결과
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |      84 |      100 |      60 |      84 |                   
 controllers     |     100 |      100 |     100 |     100 |                   
  user.js        |     100 |      100 |     100 |     100 |                   
 models          |   33.33 |      100 |       0 |   33.33 |                   
  user.js        |   33.33 |      100 |       0 |   33.33 | 5-47
 routes          |     100 |      100 |     100 |     100 | 
  middlewares.js |     100 |      100 |     100 |     100 | 
-----------------|---------|----------|---------|---------|-------------------

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 7 passed, 8 total
Snapshots:   0 total
Time:        4.826 s
Ran all test suites.

models/user.js 에서 5-47번째 줄은 테스트 되지 않았다를 의미.

4. 통합 테스트 (라우터 테스트)
 - npm i -D supertest
 1. app.js 모듈로 변경
 2. server.js 에서 require해서 app.listen
 3. npm start 명령 nodemon server로 변경
 4. config 파일에서 test DB 정보 변경
 5. npx sequelize db:create --env test 명령으로 DB 생성
 6. routes/auth.test.js 작성

5. 부하 테스트
 - npm i -D artillery
 - npm start
 - 다른 콘솔에서 npx artillery quick --count 100 -n 50 http://localhost:8001
 - Log
  All virtual users finished
  Summary report @ 10:40:54(+0900) 2020-10-06
    Scenarios launched:  100    // 가상의 100명의 사용자 생성
    Scenarios completed: 100    // 사용자 요청 완료
    Requests completed:  5000   // 총 요청 수
    Mean response/sec: 414.59   // 초당 414.59번의 요청이 처리 됨
    Response time (msec):
      min: 16.4
      max: 343.2
      median: 216.7
      p95: 294.2      // 하위 95% 값
      p99: 308.9      // 하위 99% 값  이 둘의 수치는 중위값과 차이가 적을수록 비슷한 속도로 처리되었다는 의미
    Scenario counts:
      0: 100 (100%)   // 총 사용자 수
    Codes:
      200: 5000   // 5000건 모두 200(성공) 응답 코드, Error 발생하면 Errors 항목이 추가 됨.

  * 테스트의 경우 실제 서버와 같은 사양의 서버(staging 서버라고 부름)를 생성하여 테스트 진행
  - 시나리오 작성(loadtest.json)
   npx artillery run loadtest.json
   arrivalRate 값을 조절하여 테스트, 여러 번 해서 평균치를 봐야 함.
   
  * 부하에 따른 해결 방법
   스케일 업, 스케일 아웃, 코드 개선, 클러스터링, 데이터베이스 클러스터링, 서버 캐싱(Redis)

  * 대표적 테스트 기법
   - 시스템 테스트 : QA들이 테스트 목록을 두고 체크해나가며 진행하는 테스트
   - 인수 테스트 : 알파/베타 테스트

스스로 해보기
 - 모든 함수에 유닛 테스트 작성하기(테스트 커버리지 100% 도전하기)
 - 모든 라우터에 대한 통합 테스트 작성하기
 - 부하 테스트를 통해 병목점 및 개선점 찾기