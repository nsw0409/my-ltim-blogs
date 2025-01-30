const express = require('express');
const router = express.Router();

router.use('/', require('../controllers/blog.controller'));

module.exports = router;