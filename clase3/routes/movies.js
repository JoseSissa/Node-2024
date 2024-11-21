import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

const moviesRouter = Router();

moviesRouter.get("/", MovieController.getAll);
moviesRouter.get("/:id", MovieController.getById);

moviesRouter.post("/", MovieController.create);
moviesRouter.delete("/:id", MovieController.detele);
moviesRouter.patch("/:id", MovieController.update); 

// métodos normales: GET, POST, HEAD
// métodos complejos: PUT, PATCH, DELETE
// CORS PRE-FLIGHT se le agrerga el método OPTIONS

// app.options("/movies/:id", (req, res) => {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//     res.send(200);
// });


export default moviesRouter;
