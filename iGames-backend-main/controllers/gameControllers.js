const { Aggregate } = require("mongoose");
const gamesModel = require("../models/gameModel");
const ErrorResponse = require("../utils/errorResponse");

// GET /api/games
async function getAllGames(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.page_size) || 8;
        const search = req.query.search || "";
        const skip = (page - 1) * pageSize;
        const searchQuery = { name: { $regex: ".*" + search + ".*", $options: "i" } };
        const totalDocuments = await gamesModel.find(searchQuery).countDocuments();
        const totalPages = Math.ceil(totalDocuments / pageSize);
        if (page > totalPages) {
            next(new ErrorResponse("Page not found.", 404));
        }
        const games = await gamesModel.find(searchQuery).skip(skip).limit(pageSize);
        res.json({
            success: true,
            statusCode: 200,
            response: { games: games, totalPages: totalPages },
        });
    } catch (error) {
        next(error);
    }
}

// GET /api/games/:id
async function getGameById(req, res, next) {
    try {
        const game = await gamesModel.findById(req.params.id);
        if (!game) {
            return next(new ErrorResponse(`Game with ID ${req.params.id} was not found.`, 404));
        }
        res.json({
            success: true,
            statusCode: 200,
            response: game,
        });
    } catch (error) {
        return next(error);
    }
}

// GET /api/games/random
async function getRandomGames(req, res, next) {
    try {
        const games = await gamesModel.aggregate([{ $sample: { size: 6 } }]);
        res.json({
            success: true,
            statusCode: 200,
            response: games,
        });
    } catch (error) {
        return next(error);
    }
}

// POST /api/games/multiple
async function getMultipleGamesById(req, res, next) {
    const { ids } = req.body;
    try {
        const games = await gamesModel.find({ _id: { $in: ids } });
        if (!games) {
            return next(new ErrorResponse("Game(s) not found.", 404));
        }
        res.json({
            success: true,
            statusCode: 200,
            response: games,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllGames, getGameById, getRandomGames, getMultipleGamesById };
