// server/controllers/cardController.js
const Card = require('../models/Card');

exports.list = async (req, res, next) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { nickname, type, brand, cardNumber, expMonth, expYear, limit, apr, balance, accountCategory } = req.body;
    const payload = { nickname, type, brand, expMonth, expYear, limit, apr, balance, accountCategory };
    if (cardNumber && cardNumber.trim().length >= 4) payload.last4 = cardNumber.trim().slice(-4);
    const card = await Card.create(payload);
    res.status(201).json(card);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { cardNumber, ...rest } = req.body;
    const update = { ...rest };
    if (cardNumber && cardNumber.trim().length >= 4) update.last4 = cardNumber.trim().slice(-4);
    const card = await Card.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(card);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
};
