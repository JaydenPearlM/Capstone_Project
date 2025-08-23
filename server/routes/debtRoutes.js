const router = require('express').Router();
const ctrl = require('../controllers/debtController');
const auth = require('../middleware/auth');
// apply auth middlewear
router.use(auth);

// GET /api/debts - retrieve all debts for the logged in user
router.get('/', ctrl.getAll);

// GET /api/debts/:id - retrieve specific debt by ID
router.get('/:id', ctrl.getById);

// POST /api/debts - create new debt
router.post('/', ctrl.create);

// PUT /api/debts/:id - update existing debt by ID
router.put('/:id', ctrl.update);

// DELETE /api/debts/:id - delete debt by ID
router.delete('/:id', ctrl.delete);

// POST /api/debts/:id/payment - record payment towards a specific debt
router.post('/:id/payment', ctrl.makePayment);

// GET /api/debts/:id/payments - get payment history for a specific debt
router.get('/:id/payments', ctrl.getPaymentHistory);

module.exports = router;