// server/controllers/cardController.js
const Card = require("../models/Card");

// Create a new card
exports.createCard = async (req, res) => {
  try {
    const card = await Card.create({ ...req.body, user: req.user.id });
    res.status(201).json(card);
  } catch (err) {
    console.error("createCard error:", err);
    res.status(400).json({ error: err.message || "Failed to create card" });
  }
};

// Get all cards for logged-in user
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error("getCards error:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
};

// Update a card
exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!card) return res.status(404).json({ error: "Card not found" });
    res.json(card);
  } catch (err) {
    console.error("updateCard error:", err);
    res.status(400).json({ error: err.message || "Failed to update card" });
  }
};

// Delete a card
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!card) return res.status(404).json({ error: "Card not found" });
    res.json({ success: true, id: card._id });
  } catch (err) {
    console.error("deleteCard error:", err);
    res.status(500).json({ error: "Failed to delete card" });
  }
};
