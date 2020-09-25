const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/body', (req, res) => {
    res.render('body', { title: 'Express'});
});

module.exports = router;