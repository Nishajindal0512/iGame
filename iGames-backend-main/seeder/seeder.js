const gamesData = require("./games-data.json");
const gameModel = require("../models/gameModel");
const connectToDB = require("../database/connectToDB");

connectToDB();

async function importData() {
    try {
        await gameModel.create(gamesData);
        return console.log("Data imported successfully.");
    } catch (error) {
        return console.log(error);
    }
}

async function deleteData() {
    try {
        await gameModel.deleteMany({});
        return console.log("Data deleted successfully.");
    } catch (error) {
        return console.log(error);
    }
}

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
