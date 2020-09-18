process.on('uncaughtException', (error) => {
    console.error('예기치 못한 에러', error);
});

setInterval(() => {
    throw new Error('서버를 고장내주마');
}, 1000);

setTimeout(() => {
    console.log('실행됩니다');
}, 2000);

/**
 * 예기치 못한 에러 처리
 * try/catch로 처리못한 에러가 발생했지만 프로세스가 종료되지 않음.
 * process에 on('uncaughtException') 이벤트 리스너를 달아 처리못한 에러가 발생했을때
 * 프로세스가 종료되는 것을 방지, 이 부분이 없으면 프로세스는 종료됨.
 * 
 * uncaughtException은 이후 동작이 제대로 동작하는지 보증하지 않음.
 * 따라서 uncaughtException은 로그를 남기는 용도로 사용하고 에러 발생 시 프로세스를 종료시켜
 * 수정해야 함.
 * 서버 운영은 에러와의 싸움. 철저히 로깅하는 습관을 들이고, 주기적으로 로그 확인하면서
 * 지속적으로 보완해 나가야 함.
 * 
 * 자주 발생하는 에러들
 * node: command not found - 노드 설치 했지만 환경변수가 설정되어 있지 않음.
 * ReferenceError: 모듈 is not defined - 해당 모듈을 require 했는지 확인.
 * Error: Cannot find module 모듈명: 해당 모듈을 require 했지만 설치하지 않음. npm i 명령어로 설치
 * Error: Can't set headers after they are sent: 요청에 대한 응답을 보낼 때 두 번 이상 보냄.
 * FATAL ERROR: CALL_AND_RETRY_LAST Allocation filed - JavaScript heap out of memory - 코드 실행 시
 *  메모리 부족. 코드가 정상이지만 메모리가 부족한 경우 노드 실행 시 --max-old-space-size-4096 파일명으로 메모리를 늘려주면 됨.
 * UnhandledPromiseRejectionWarning: Unhandled promise rejection - 프로미스 사용 시 catch메서드를 생략한 경우
 * EADDRINUSE 포트번호 - 해당 포트 이미 사용 중
 * 
 * 윈도우에서 프로세스 종료 하기
 * netstat -ano | findstr 포트
 * taskkill /pid 프로세스아이디 /f
 * 
 * 맥에서 프로세스 종료 하기
 * lsof -i tcp:포트
 * kill -9 프로세스아이디
 */