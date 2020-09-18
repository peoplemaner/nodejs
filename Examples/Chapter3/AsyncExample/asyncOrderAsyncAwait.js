const fs = require('fs/promises');

async function ReadMultiFile(){
    console.log('시작');

    let data = await fs.readFile(`${__dirname}/readme.txt`);
    console.log('1번', data.toString());
    data = await fs.readFile(`${__dirname}/readme.txt`);
    console.log('2번', data.toString());
    data = await fs.readFile(`${__dirname}/readme.txt`);
    console.log('3번', data.toString());

    console.log('끝');
}

ReadMultiFile();