const fs = require('fs').promises;

fs.readFile(`${__dirname}/readme.txt`)
    .then((data) => {
        console.log(data);
        console.log(data.toString());
    })
    .catch((error) => {
        console.error(error);
    });

async function readFile () {
    try {
        const data = await fs.readFile(`${__dirname}/readme.txt`);
        console.log('async function');
        console.log(data.toString());
    } catch (error) {
        console.error(error);
    }
}

readFile();