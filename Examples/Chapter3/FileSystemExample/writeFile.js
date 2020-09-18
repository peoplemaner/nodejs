const fs = require('fs/promises');
console.log(__dirname);
fs.writeFile(`${__dirname}/writeFile.txt`, '글이 입력됩니다')
    .then(() => {
        return fs.readFile(`${__dirname}/writeFile.txt`);
    })  
    .then((data) => {
        console.log(data.toString());
    })
    .catch((error) => {
        console.error(error);
    });

async function writeFile () {
    try {
        await fs.writeFile(`${__dirname}/writeFile2.txt`, '글이 입력됩니다');
        const data = await fs.readFile(`${__dirname}/writeFile2.txt`);
        console.log(data.toString());
    } catch (error) {
        console.error(error);
    }
}

writeFile();