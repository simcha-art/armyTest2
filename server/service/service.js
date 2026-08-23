import { gameStateRepo, mapRepo } from "../repo/repository.js";

const service = {
    createNewGame: async (playerName) => {
        let territories = await mapRepo.getAllTerritories();
        if (territories.length === 0) {
            await mapRepo.createMap();
            territories = mapRepo.getAllTerritories();
        }

        const territoriesList = territories.map((t) => {
            t.owner = t.startOwner;
            delete t._id;
            if (t.headquarters) {
                t.soldiers = 8;
            } else {
                t.headquarters = false;
                t.soldiers = 4;
            }
            return t;
        });
        const newId = await gameStateRepo.create(playerName, territoriesList);
        const newGame = await gameStateRepo.getById(newId);
        newGame.id = newId;
        delete newGame._id;
        return newGame;
    },

    getExistGame: (gameId) => {
        const game = gameStateRepo.getById(gameId)
        if (!game) {
            const err = new Error("game not found")
            err.status = 404
            throw err
        }
        return game
    },

    reinforce: async (gameId, game, territoryId) => {
        let err;
        if (game.phase !== "reinforce") {
            err = new Error("You cannot reinforce now")
            err.status = 400
            throw err
        }

        const reinforcedTerritory = game.territories.find(t => t.id === territoryId)
        if (reinforcedTerritory.owner !== "player") {
            err = new Error("You can reinforce only your territories")
            err.status = 400
            throw err
        }

        reinforcedTerritory.soldiers += 3;
        game.phase = "attack"

        const updatedGame = await gameStateRepo.update(gameId, game)
        updatedGame.id = updatedGame._id.toString()
        delete updatedGame._id
        return updatedGame
    }
};

export { service };
