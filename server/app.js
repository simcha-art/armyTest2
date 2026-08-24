import express from "express";
import cors from "cors";
import env from "dotenv";
import { errorHandler, logger, validGame } from "./middleware/middlewares.js";
import {
    attack,
    createNewGame,
    endTurn,
    getExistGame,
    move,
    reinforce,
} from "./controller/controller.js";
env.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);

app.post("/games", createNewGame);

app.get("/games/:id", getExistGame);
app.post("/games/:id/reinforce", validGame, reinforce);
app.post("/games/:id/attack", validGame, attack);
app.post("/games/:id/move", validGame, move);
app.post("/games/:id/end-turn", validGame, endTurn);

app.use(errorHandler);

app.listen(PORT, () => console.log(`listenning on port ${PORT}`));
