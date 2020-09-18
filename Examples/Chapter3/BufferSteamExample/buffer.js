const buffer = Buffer.from('저를 버퍼로 바꿔보세요');   // 문자열 > 버퍼
console.log('from():', buffer);
console.log('length:', buffer.length);  // 버퍼 크기(byte)
console.log('toString():', buffer.toString());  // 버퍼 > 문자열

const array = [Buffer.from('띄엄 '), Buffer.from('띄엄 '), Buffer.from('띄어쓰기')];
const buffer2 = Buffer.concat(array);   // 배열 안에 든 버퍼들을 합침.
console.log('concat():', buffer2.toString());

const buffer3 = Buffer.alloc(5);    // 빈 버퍼 생성, byte를 인수로 넣으면 해당 크기 버퍼 생성
console.log('alloc():', buffer3);

/**
 * readFile 방식의 버퍼가 편리하기는 하지만 문제점이 있음.
 * 용량이 100MB인 파일이 있으면 읽을 때 메모리에 100MB의 버퍼를 만듦, 이 작업이 10개인 경우 1GB 메모리를 사용하게 됨.
 * 또한, 모든 내용을 버퍼에 다 쓴 후에야 다음 동작으로 넘어가므로 파일 읽기, 압축, 파일 쓰기 등의 조작을 연달아 할 때
 * 매번 전체 용량을 버퍼로 처리해야 다음 단계로 넘어감.
 * 
 * > 해결책 Stream
 */