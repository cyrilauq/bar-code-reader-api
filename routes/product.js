const authenticate = require('../middleware/authenticate');

const router = require('express').Router();

router.get('test', authenticate, (req, res) => {
    res.send('hello');
})

module.exports = router;