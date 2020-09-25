const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => {
    res.render('main');
});

module.exports = router;