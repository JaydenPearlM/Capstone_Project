// server/routes/cardRoutes.js
const router = require('express').Router();
const ctrl = require('../controllers/cardController');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
