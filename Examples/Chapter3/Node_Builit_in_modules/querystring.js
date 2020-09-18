// url.parse() 사용 시 search부분을 개체로 만들기 위한 모듈
const url = require('url');
const querystring = require('querystring');

const parseUrl = url.parse('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript');
const query = querystring.parse(parseUrl.query);
console.log('querystring.parse():', query);     // search 부분은 개체로 분해
console.log('querystring.stringify():', querystring.stringify(query));  // query개체를 문자열로 반환