import express from "express";
import cors from "cors";
import env from "dotenv";
env.config()

const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())


app.post("/games", (req, res) => res.end("not implemented"))
app.get("/games/:id", (req, res) => res.end("not implemented"))
app.post("/games/:id/reinforce", (req, res) => res.end("not implemented"))
app.post("/games/:id/attack", (req, res) => res.end("not implemented"))
app.post("/games/:id/move", (req, res) => res.end("not implemented"))
app.post("/games/:id/end-turn", (req, res) => res.end("not implemented"))


app.listen(PORT, () => console.log(`listenning on port ${PORT}`))