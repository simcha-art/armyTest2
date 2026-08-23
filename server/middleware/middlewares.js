import { gameStateRepo } from "../repo/repository.js";

function logger(req, res, next) {
    console.log(`${req.method} | ${req.url} | body`, req.body);
    next();
}

function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.status || 500;
    const msg = { error: err.message || "internal server error" };
    res.status(status).json(msg);
}

async function validGame(req, res, next) {
    let err;
    const existGame = await gameStateRepo.getById(req.params.id)
    if (!existGame) {
        err = new Error("game not found")
        err.status = 404
        throw err
    }

    if (existGame.status !== "playing") {
        err = new Error("game is already finished")
        err.status = 409
        throw err
    }

    req.game = existGame
    next()
}


export { logger, errorHandler, validGame };
