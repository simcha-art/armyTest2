import { getCollections } from "../db/mongodb.js";
import fs from "node:fs/promises";
const FILEPATH = "./server/repo/map.json";
import { ObjectId } from "mongodb";

const { gameStateCollection, territoryCollection } = await getCollections();

const mapRepo = {
    createMap: async () => {
        const territories = await fs
            .readFile(FILEPATH, "utf8")
            .then((data) => JSON.parse(data));
        await territoryCollection.insertMany(territories);
    },
    getAllTerritories: async () => {
        const territories = await territoryCollection.find({}).toArray();
        return territories;
    },
};

const gameStateRepo = {
    create: async (playerName, territoriesList) => {
        const result = await gameStateCollection.insertOne({
            playerName,
            round: 1,
            phase: "reinforce",
            status: "playing",
            winner: null,
            territories: territoriesList,
        });
        return result.insertedId.toString();
    },
    getById: async (gameId) => {
        const gameState = await gameStateCollection.findOne({
            _id: new ObjectId(gameId),
        });
        gameState.id = gameState._id.toString()
        delete gameState._id
        return gameState;
    },
    update: async (gameId, updatedData) => {
        const updated = await gameStateCollection.findOneAndUpdate(
            { _id: new ObjectId(gameId) },
            { $set: updatedData },
            { returnDocument: "after" },
        );
        updated.id = updated._id.toString()
        delete updated._id
        return updated;
    },
};

export { gameStateRepo, mapRepo };
