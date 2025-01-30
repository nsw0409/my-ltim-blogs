const express = require('express');
const router = express.Router();

router.use('/', require('../controllers/comment.controller'));

module.exports = router;