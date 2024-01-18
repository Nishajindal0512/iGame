const express = require("express");
const gameControllers = require("../controllers/gameControllers");

const router = express.Router();

router.post("/multiple", gameControllers.getMultipleGamesById);
router.get("/", gameControllers.getAllGames);
router.get("/random", gameControllers.getRandomGames);
router.get("/:id", gameControllers.getGameById);

module.exports = router;
