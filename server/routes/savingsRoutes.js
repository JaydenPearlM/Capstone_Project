const router = require('express').Router();
const ctrl = require('../controllers/savingsController');
const auth = require('../middleware/auth');
// Use proper authentication middleware
router.use(auth);  

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.post('/:id/contribute', ctrl.contribute);
router.delete('/:id', ctrl.delete);        
router.post('/:id/contribute', ctrl.contribute);

module.exports = router;
