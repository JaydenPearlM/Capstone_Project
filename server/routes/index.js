const router = require('express').Router();
const logger = require('../config/logger');
router.use('/transactions', require('./transactionRoutes'));
router.use('/categories', require('./categoryRoutes.js'));

router.use('/debts', require('./debtRoutes'));
router.use('/savings', require('./savingsRoutes.js'));
router.use('/cards', require('./cardRoutes'));
router.use('/reports', require('./reportRoutes'));


router.use('/savings', require('./savingsRoutes.js'));
router.use('/debts', require('./debtRoutes.js'));
const logger = require('../config/logger');


module.exports = router;
