const router = require('express').Router();
router.use('/transactions', require('./transactionRoutes'));
router.use('/categories', require('./categoryRoutes.js'));
router.use('/savings', require('./savingsRoutes.js'));
router.use('/debts', require('./debtRoutes.js'));
const logger = require('../config/logger');

module.exports = router;
