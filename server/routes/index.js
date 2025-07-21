const router = require('express').Router();
router.use('/transactions', require('./transactionRoutes'));
router.use('/categories', require('./categoryRoutes.js'));
module.exports = router;
