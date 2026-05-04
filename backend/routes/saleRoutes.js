const express = require('express');
const router = express.Router();
const { createSale, getSales } = require('../controllers/saleController');

router.route('/')
    .get(getSales)
    .post(createSale);

module.exports = router;