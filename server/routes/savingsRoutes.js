const router = require('express').Router();
const ctrl = require('../controllers/savingsController');
const auth = require('../middleware/auth');
// apply authentication middlewear 
router.use(auth);  

// GET /api/savings - get all savings goals for user
router.get('/', ctrl.getAll);

// POST /api/savings - create new savings goal
router.post('/', ctrl.create);

// PUT /api/savings/:id - update existing savings goal by ID
router.put('/:id', ctrl.update);

// POST /api/savings/:id/contribute - add money to specific savings goal
router.post('/:id/contribute', ctrl.contribute);

// DELETE /api/savings/:id - delete savings goal by ID
router.delete('/:id', ctrl.delete);        


module.exports = router;
