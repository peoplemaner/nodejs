const EventEmitter = require('events');

const myEvent = new EventEmitter();
myEvent.addListener('event1', () => {
    console.log('이벤트 1');
});
myEvent.on('event2', () => {
    console.log('이벤트 2');
});
myEvent.on('event2', () => {
    console.log('이벤트 2 추가');
});
myEvent.once('event3', () => {
    console.log('이벤트 3');
}); // 한번만 실행

myEvent.emit('event1');
myEvent.emit('event2');

myEvent.emit('event3');
myEvent.emit('event3');

myEvent.on('event4', () => {
    console.log('이벤트 4');
});
myEvent.removeAllListeners('event4');
myEvent.emit('event4'); // 실행 안 됨

const listener = () => {
    console.log('이벤트 5');
};
myEvent.on('event5', listener);
myEvent.removeAllListeners('event5', listener);
myEvent.emit('event5'); // 실행 안 됨
console.log(myEvent.listenerCount('event2'));

/**
 * events 모듈
 * on(이벤트명, 콜백), addListener(이벤트명, 콜백) : 이벤트 이름과 이벤트 발생 시 콜백을 연결, 여러 개 콜백 등록 가능.
 * emit(이벤트명) : 이벤트를 호출하는 메서드
 * once(이벤트명, 콜백) : 한번만 실행되는 이벤트
 * removeAllListeners(이벤트명) : 해당 이벤트 리스너 전체 제거
 * removeListener(이벤트명, 리스너) : 이벤트에 연결된 리스너를 하나씩 제거
 * listenerCount(이벤트명) : 현재 리스너가 몇 개 연결되어 있는지 확인
 */