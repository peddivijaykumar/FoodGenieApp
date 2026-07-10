const express = require("express");
const { generateRecipe } = require("../controllers/recipeController");
const router = express.Router();

router.post("/generate", generateRecipe);

module.exports = router;