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
        const game = req.game;
        const territoryId = req.body.territoryId;
        const updatedGame = await service.reinforce(game, territoryId);
        const response = {
            game: updatedGame,
            playerEvent: {
                type: "reinforce",
                territoryId,
                soldiersAdded: 3,
            },
            computerEvents: [],
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
}

async function attack(req, res, next) {
    try {
        let response;
        const game = req.game;

        if (req.body.skip) {
            const gameState = await service.skip(game);
            response = {
                game: gameState,
                playerEvent: null,
                computerEvents: [],
            };
            return res.json(response);
        }

        const { fromId, toId, soldiers } = req.body;
        if (!fromId || !toId || !soldiers) {
            const err = "Invalid body, should contain fromId, toId, soldiers";
            err.status = 400;
            throw err;
        }

        const [updatedGame, attackWinner] = await service.attack(
            game,
            fromId,
            toId,
            soldiers,
        );
        response = {
            game: updatedGame,
            playerEvent: {
                type: "attack",
                fromId,
                toId,
                soldiers,
                winner: attackWinner,
            },
            computerEvents: [],
        };

        console.log(response.playerEvent.Winner);
        res.json(response);
    } catch (error) {
        next(error);
    }
}

async function move(req, res, next) {
    try {
        const game = req.game;
        const { fromId, toId, soldiers } = req.body;
        if (!fromId || !toId || !soldiers) {
            const err = new Error(
                "body must contain fromId, toId and soldiers",
            );
            err.stutus = 400;
            throw err;
        }
        const updatedGameByMove = await service.move(
            game,
            fromId,
            toId,
            soldiers,
        );
        const { updatedGame, computerEvents } =
            await service.computerTurn(game);
        const response = {
            game: updatedGame,
            playerEvent: {
                type: "move",
                fromId,
                toId,
                soldiers,
            },
            computerEvents,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
}

async function endTurn(req, res, next) {
    try {
        const game = req.game;
        service.endTurn(game);
        const { updatedGame, computerEvents } =
            await service.computerTurn(game);
        const response = {
            game,
            playerEvent: null,
            computerEvents,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
}

export { createNewGame, getExistGame, reinforce, attack, move, endTurn };
