<<<<<<< HEAD
// server/routes/categoryRoutes.js
const router = require('express').Router();
const ctrl   = require('../controllers/categoryController');
const logger = require('../config/logger');
=======
const express = require('express');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
>>>>>>> main

const router = express.Router();


// const router = require('express').Router();
// const ctrl   = require('../controllers/categoryController');
// const logger = require('../config/logger');

// GET all categories
// router.get('/categories',    ctrl.getAll);
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
})

// POST create category
// router.post('/',   ctrl.create);
router.post('/', async(req, res) => {
  const {name, budget} = req.body;
  const newCategory = new Category({name, budget});
  const saved = await newCategory.save();
  res.json(saved);
})

// PUT update category
//router.put('/:id', ctrl.update);
router.put('/:id', async (req, res) => {
  const { name, budget } = req.body;
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    { name, budget },
    { new: true }
  );
  res.json(updated);
});

// DELETE category and its transactions
// router.delete('/:id', ctrl.remove);
router.delete('/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  await Transaction.deleteMany({ categoryId: req.params.id });
  res.json({ success: true });
});

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

