const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes');
const userRouter = require('./routes/user');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'session-cookie'
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

// next('route')
app.get('/', (req, res, next) => {
    next('route');
}, (req, res, next) => {
    console.log('실행되지 않습니다');
    next();
}, (req, res, next) => {
    console.log('실행되지 않습니다');
    next();
});

app.get('/', (req, res) => {
    console.log('실행됩니다');
    res.send('Hello Express');
});

// /user/:id (req.params)
app.get('/user/:id', (req, res) => {
    console.log(req.params, req.query);
    // /users/123?limit=5&skip=10 --> req.params = { id = 123 }, req.query = { limit: '5', skip: '10' }
});

// 실행 되지 않음, 라우트 순서의 주의!
app.get('/user/like', (req, res) => {
});

// route 합치기
app.route('/abc')
    .get((req, res) => {
        res.send('GET /abc');
    })
    .post((req, res) => {
        res.send('POST /abc');
    });
 
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(3000, () => {
    console.log('3000 port Server listening');
});