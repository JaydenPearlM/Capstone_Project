const router = require('express').Router();
const ctrl   = require('../controllers/transactionController');
// optional: add validation/auth middleware here later
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: A list of transactions.
 */
router.get('/',   ctrl.getAll);
router.get('/:id',ctrl.getById);
router.post('/',  ctrl.create);
router.put('/:id',ctrl.update);
router.delete('/:id',ctrl.remove);
module.exports = router;
