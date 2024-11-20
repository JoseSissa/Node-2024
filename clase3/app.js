import express, { json } from "express";
import moviesRouter from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();

// Middleware para parsear el body de la petición
app.use(json());
app.use(corsMiddleware())

app.disable("x-powered-by"); // disable express powered by header

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/movies", moviesRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
