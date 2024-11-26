// import { MovieModel } from "../models/local-file-system/movie.js";
import { MovieModel } from "../models/mysql/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MovieController {
    static async getAll (req, res) {
        const { genre } = req.query;
        const MOVIES = await MovieModel.getAll({ genre });
        // Este controller nos dice qué es lo que renderiza
        res.json(MOVIES);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        res.json(movie);
    }

    static async create(req, res) {
        const result = validateMovie(req.body);

        if (result.error) {
            return res
                .status(400)
                .json({ error: JSON.parse(result.error.message) });
        }
        // Proceso que debería hacer algo en la DB
        const newMovie = await MovieModel.create({ input: result.data});
        res.status(201).json(newMovie);
    }

    static async detele(req, res) {
        // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
        const { id } = req.params;
        const result = await MovieModel.delete({ id });
        if (result === false) {
            return res.status(404).json({ error: "Movie not found" });
        }
        return res.json({ message: "Movie deleted successfully" });
    }

    static async update(req, res) {
        const result = validatePartialMovie(req.body);
        if (result.error) {
            return res
                .status(400)
                .json({ error: JSON.parse(result.error.message) });
        }
    
        const { id } = req.params;
        const updatedMovie = await MovieModel.update({ id, result });
    
        if (updatedMovie === false) {
            return res.status(404).json({ error: "Movie not found" });
        }
        return res.json(updatedMovie);
    }
}