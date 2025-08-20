import express from "express";
import Card from "../models/Card.js";

const router = express.Router();

// GET all cards
router.get("/", async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

// POST new card
router.post("/", async (req, res) => {
  const card = new Card(req.body);
  await card.save();
  res.status(201).json(card);
});

// DELETE a card
router.delete("/:id", async (req, res) => {
  await Card.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Optional: UPDATE a card
router.put("/:id", async (req, res) => {
  const updated = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export default router;