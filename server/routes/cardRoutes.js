const express = require("express");
const {
  createCard,
  getCards,
  updateCard,
  deleteCard,
} = require("../controllers/Cardcontroller");

// IMPORTANT: your auth middleware exports a default function
const protect = require("../middleware/auth");

const router = express.Router();

// Optional: global protect for the entire router
router.use(protect);

// Runtime guard to catch undefined handlers early (kept from your version):
const fns = { protect, createCard, getCards, updateCard, deleteCard };
for (const [name, fn] of Object.entries(fns)) {
  if (typeof fn !== "function") throw new Error(`Handler ${name} is not a function`);
}

router.post("/", createCard);
router.get("/", getCards);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);

module.exports = router;
