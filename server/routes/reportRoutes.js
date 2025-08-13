const router = require('express').Router();
const tempUser = require('../middleware/tempUser');
const reportCTRL = require('../controllers/reportController');

router.use(tempUser);

// GET /api/v1/reports/

router.get('/csv', reportCTRL.csv);

module.exports = router;