import express from "express";
import cors from "cors";
import env from "dotenv";
import { errorHandler, logger, validGame } from "./middleware/middlewares.js";
import {
    createNewGame,
    getExistGame,
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
app.post("/games/:id/attack", (req, res) => res.end("not implemented"));
app.post("/games/:id/move", (req, res) => res.end("not implemented"));
app.post("/games/:id/end-turn", (req, res) => res.end("not implemented"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`listenning on port ${PORT}`));
