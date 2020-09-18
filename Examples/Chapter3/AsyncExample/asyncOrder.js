const fs = require('fs');

console.log('시작');
fs.readFile(`${__dirname}/readme.txt`, (error, data) => {
    if (error) throw error;
    console.log('1번', data.toString());
    fs.readFile(`${__dirname}/readme.txt`, (error, data) => {
        if (error) throw error;
        console.log('2번', data.toString());
        fs.readFile(`${__dirname}/readme.txt`, (error, data) => {
            if (error) throw error;
            console.log('3번', data.toString());
            console.log('끝');
        });
    });
});

/**
 * 비동기 처리이나 콜백 지옥
 */