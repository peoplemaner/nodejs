const url = require('url');

const { URL } = url;
const myURL = new URL('http://www.gilbut.oc.kr/book/bookList.aspx?sercate1=001001000#anchor');
console.log('new URL():', myURL);
console.log('url.format():', url.format(myURL));
console.log('-------------------------------------');
const parseUrl = url.parse('http://www.gilbut.oc.kr/book/bookList.aspx?sercate1=001001000#anchor');
console.log('url.parse():', parseUrl);
console.log('url.format():', url.format(parseUrl));

/**
 * url.parse(주소) : WHATWG방식과 비교하면 username과 password 대신 auth 속성이 있고, serachParams 대신 query가 있음.
 *                  host부분 없이 pathname 부분만 오는 경우 처리 가능 WHATWG 처리 불가능
 * new URL(주소) (WHATWG 방식) : searchParams 유용하게 사용가능
 */