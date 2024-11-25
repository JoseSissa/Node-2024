// Script para volcar los datos de las movies del archivo JSON a la DB MYSQL
import { getJSON } from "../utils/utils.js";

const MOVIES = getJSON("../movies.json");


let sql_movies = "INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES ";
MOVIES.forEach((movie, index) => {
    if (index === MOVIES.length - 1) {
        sql_movies += `(UUID_TO_BIN(UUID()), '${movie.title}', ${movie.year}, '${movie.director}', ${movie.duration}, '${movie.poster}', ${movie.rate});`;
        return;
    }
    sql_movies += `(UUID_TO_BIN(UUID()), '${movie.title}', ${movie.year}, '${movie.director}', ${movie.duration}, '${movie.poster}', ${movie.rate}), \n`;
});

console.log(sql_movies);
    
let sql_genres = "INSERT INTO movie_genre (movie_id, genre_id) VALUES \n";
MOVIES.forEach((movie, i) => {
    movie.genre.forEach((genre, j) => {
        if (i === MOVIES.length - 1 && j === movie.genre.length - 1) {
            sql_genres += 
                `((SELECT id FROM movie WHERE title = '${movie.title}'),(SELECT id FROM genre WHERE name = '${genre}'));`;
            return;
        }
        sql_genres += 
            `((SELECT id FROM movie WHERE title = '${movie.title}'),(SELECT id FROM genre WHERE name = '${genre}')), \n`;
    });
});

console.log(sql_genres);