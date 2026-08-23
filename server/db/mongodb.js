import { MongoClient } from "mongodb";
import env from "dotenv";
env.config({ path: "./server/.env" });

const URI = process.env.MONGODB_LONG_URI;

const client = new MongoClient(URI);
let db;
let territoryCollection;
let gameStateCollection;

function initDB() {
    db = client.db("WarGame");
}

function initCollections() {
    territoryCollection = db.collection("territories");
    gameStateCollection = db.collection("gameStates");
}

async function getCollections() {
    await client.connect();
    initDB();
    initCollections();
    return { territoryCollection, gameStateCollection };
}

export { getCollections };

