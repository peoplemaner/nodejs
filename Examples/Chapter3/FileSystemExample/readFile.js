const fs = require('fs');

fs.readFile(`${__dirname}/readme.txt`, (err, data) => {
    if (err) throw err;
    console.log(data);
    console.log(data.toString());
});