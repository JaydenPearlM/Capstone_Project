const router = require('express').Router();
const ctrl = require('../controllers/savingsController');
const tempUser = require('../middleware/tempUser');
//temp user for testing
router.use(tempUser);  

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.post('/:id/contribute', ctrl.contribute);

module.exports = router;
