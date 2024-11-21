import { getJSON } from "../utils/utils.js";
import { randomUUID } from "node:crypto";

const MOVIES = getJSON("../movies.json");

export class MovieModel {
    static getAll = async ({ genre }) => {
        if (genre) {
            const filteredMovies = MOVIES.filter((movie) => {
                return movie.genre.some((g) => {
                    return g.toLowerCase() === genre.toLowerCase();
                });
            });
            return filteredMovies;
        }
        return MOVIES
    }

    static async getById({ id }) {
        const movie = MOVIES.find((movie) => movie.id === id);
        return movie;
    }

    static async create(input) {
        // Proceso que debería hacer algo en la DB
        const newMovie = {
            id: randomUUID(),
            ...input,
        }

        MOVIES.push(newMovie);
        return newMovie;
    }

    static async delete({ id }) {
        const movieIndex = MOVIES.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) return false
        MOVIES.splice(movieIndex, 1);
        return true
    }

    static async update({ id, result }) {
        const movieIndex = MOVIES.findIndex((movie) => movie.id === id);

        if (movieIndex === -1) return false

        MOVIES[movieIndex] = {
            ...MOVIES[movieIndex],
            ...result.data,
        };

        return MOVIES[movieIndex]
    }
}