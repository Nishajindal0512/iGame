const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    platforms: [{ type: String, required: true }],
    releaseDate: { type: String, required: true },
    price: { type: Number, required: true },
    metacriticRating: { type: Number, required: true },
    esrbRating: { type: String, required: true },
    genres: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
    videos: [{ type: String, required: true }],
});

const gameModel = mongoose.model("game", gameSchema);

module.exports = gameModel;
