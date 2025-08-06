const router = require('express').Router();
router.use('/transactions', require('./transactionRoutes'));
router.use('/categories', require('./categoryRoutes.js'));
const logger = require('../config/logger');
router.use('/savings', require('./savingsRoutes.js'));

module.exports = router;
