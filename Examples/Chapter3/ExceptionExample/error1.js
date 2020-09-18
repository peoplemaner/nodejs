setInterval(() => {
    console.log('시작');
    try {
        throw new Error('서버를 고장내주마!');
    } catch (error) {
        console.error(error);
    }
}, 1000);

/**
 * try/catch문으로 처리하여 노드 프로세스가 종료 되는 것을 방지.
 */