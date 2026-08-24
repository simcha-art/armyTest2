import { gameStateRepo, mapRepo } from "../repo/repository.js";
import { calculatePower, calculateSurvivals } from "../helper/logics.js";

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
        return newGame;
    },

    getExistGame: (gameId) => {
        const game = gameStateRepo.getById(gameId);
        if (!game) {
            const err = new Error("game not found");
            err.status = 404;
            throw err;
        }
        return game;
    },

    reinforce: async (game, territoryId) => {
        let err;
        if (game.phase !== "reinforce") {
            err = new Error("You cannot reinforce now");
            err.status = 400;
            throw err;
        }

        const reinforcedTerritory = game.territories.find(
            (t) => t.id === territoryId,
        );
        if (reinforcedTerritory.owner !== "player") {
            err = new Error("You can reinforce only your territories");
            err.status = 400;
            throw err;
        }

        reinforcedTerritory.soldiers += 3;
        game.phase = "attack";

        const updatedGame = await gameStateRepo.update(game.id, game);
        return updatedGame;
    },

    skip: async (game) => {
        if (game.phase !== "attack") {
            err = new Error("Skip is available only in phase 'attack'");
            err.status = 400;
            throw err;
        }

        game.phase = "move";
        const updatedGame = await gameStateRepo.update(game.id, game);
        return updatedGame;
    },

    attack: async (game, fromId, toId, soldiers) => {
        // data
        const fromTerr = game.territories.find((t) => t.id === fromId);
        const toTerr = game.territories.find((t) => t.id === toId);

        // validation
        let err;
        if (game.phase !== "attack") {
            err = new Error("You cannot attack now");
        }

        if (fromTerr.owner !== "player") {
            err = new Error("You can attack only from your territory");
        }

        if (toTerr.owner !== "computer") {
            err = new Error("You can attack only computer's territories");
        }

        if (!fromTerr.neighbors.includes(toId)) {
            err = new Error("You can attack only neighbors territories");
        }

        if (soldiers < 1) {
            err = new Error("to attack, you must send at least 1 soldier");
        }

        if (soldiers !== Math.round(soldiers)) {
            err = new Error("soldiers number must be an integer");
        }

        if (fromTerr.soldiers === soldiers) {
            err = new Error(
                "You must leave at least one soldier to protect the territory",
            );
        }

        if (fromTerr.soldiers < soldiers) {
            err = new Error(
                "You are asking for more soldiers then you have in the territory",
            );
        }

        if (err) {
            err.status = 400;
            throw err;
        }

        // war part
        fromTerr.soldiers -= soldiers;
        let attackWinner;
        const attackPower = calculatePower(soldiers);
        const defencePower = calculatePower(toTerr.soldiers);
        if (attackPower > defencePower) {
            attackWinner = "player"
            toTerr.owner = "player";
            toTerr.soldiers = calculateSurvivals(
                soldiers,
                attackPower,
                defencePower,
            );
        } else {
            attackWinner = "computer"
            toTerr.soldiers = calculateSurvivals(
                toTerr.soldiers,
                defencePower,
                attackPower,
            );
        }

        // check winning and build response
        if (toTerr.owner === "player" && toTerr.headquarters) {
            game.status = "finished";
            game.winner = "player";
        } else {
            game.phase = "move";
        }

        const updatedGame = await gameStateRepo.update(game.id, game);
        return [updatedGame, attackWinner];
    },
};

export { service };
