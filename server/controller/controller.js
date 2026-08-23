import { service } from "../service/service.js";

async function createNewGame(req, res, next) {
    try {
        const playerName = req.body.playerName.trim();
        if (!playerName) {
            const err = new Error("You did not enter player name");
            err.status = 400;
            throw err;
        }
        const newGame = await service.createNewGame(playerName);
        console.log(newGame);
        res.json(newGame);
    } catch (error) {
        next(error);
    }
}

async function getExistGame(req, res, next) {
    try {
        const gameId = req.params.id;
        const existGame = await service.getExistGame(gameId);
        res.json(existGame);
    } catch (error) {
        next(error);
    }
}

async function reinforce(req, res, next) {
    try {
        const gameId = req.params.id;
        const game = req.game;
        const territoryId = req.body.territoryId;
        const updatedGame = await service.reinforce(gameId, game, territoryId);
        const response = {
            game: updatedGame,
            playerEvent: {
                type: "reinforce",
                territoryId,
                soldiersAdded: 3,
            },
            computerEvents: [],
        };
        console.log(response.game)
        res.json(response);
    } catch (error) {
        next(error);
    }
}

export { createNewGame, getExistGame, reinforce };
