// server/routes/categoryRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/categoryController');
const logger = require('../config/logger');

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',   ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

const { body, validationResult } = require('express-validator');

router.post(
  '/',
  [
    body('name').isString().notEmpty(),
    body('type').isIn(['income','expense']),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  ctrl.create
);


module.exports = router;

