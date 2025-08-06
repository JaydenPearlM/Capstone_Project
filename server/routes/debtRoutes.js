const router = require('express').Router();
const ctrl = require('../controllers/debtController');
const tempUser = require('../middleware/tempUser');

router.use(tempUser);

router.get('/', ctrl.getAll);

router.get('/:id', ctrl.getById);

router.post('/', ctrl.create);

router.put('/:id', ctrl.update);

router.delete('/:id', ctrl.delete);

router.post('/:id/payment', ctrl.makePayment);

router.get('/:id/payments', ctrl.getPaymentHistory);

module.exports = router;