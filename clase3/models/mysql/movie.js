// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
// Create the connection to database
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_movies_db',
});

export class MovieModel {
    static getAll = async ({ genre }) => {
        if(genre) {
            // Get the genre id from genre table
            const lowerGenre = genre.toLowerCase();
            const [idGenre] = await connection.query(
                // `SELECT id FROM genre WHERE LOWER(name) = '${lowerGenre}'`
                `SELECT id FROM genre WHERE LOWER(name) = ?;`, [lowerGenre]
            );
            if(idGenre.length === 0) return [];

            // Get all movie from movie_genre table
            const [moviesFromGenre] = await connection.query(`
                SELECT BIN_TO_UUID(movie_id) movie_id 
                FROM movie_genre
                WHERE genre_id = ?;`,
                [idGenre[0].id]
            );
            if(moviesFromGenre.length === 0) return [];

            // Get all movies from movie table with last id from movie_genre table
            const promises = moviesFromGenre.map(async (idMovie) => {
                const [movieFromDB] = await connection.query(`
                    SELECT title, year, director, duration, poster, rate FROM movie
                    WHERE BIN_TO_UUID(id) = ?;`, [idMovie.movie_id]
                )
                return movieFromDB[0];
            })    
            const moviesFiltered = await Promise.all(promises);
            return moviesFiltered;
        }

        const [movies] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie'
        );

        const promises = movies.map(async (movie) => {
            const genres = await connection.query(`
                SELECT BIN_TO_UUID(movie_id) movie_id, genre_id, name 
                FROM movie_genre
                INNER JOIN genre ON genre_id = genre.id
                WHERE BIN_TO_UUID(movie_id) = ?;`,
                [movie.id]
            );
            // console.log(genres[0]);
            movie.genre = genres[0].map((genre) => genre.name);
            return movie;
        })

        await Promise.all(promises);

        return movies;
    }

    static async getById({ id }) {
        const [movie] = await connection.query(`
            SELECT title, year, director, duration, poster, rate FROM movie 
            WHERE BIN_TO_UUID(id) = ?;`,
            [id]
        );
        if (!movie) return [];
        return movie;
    }

    static async create({ input }) {
        const { title, year, director, duration, poster, genre, rate } = input;
        const [uuidResult] = await connection.query(`SELECT UUID() uuid;`);
        const [{ uuid }] = uuidResult;

        await connection.query(`
            INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES 
            (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`, 
            [ title, year, director, duration, poster, rate ]
        );

        const [newMovie] = await connection.query(`
            SELECT title, year, director, duration, poster, rate FROM movie 
            WHERE BIN_TO_UUID(id) = ?;`,
            [uuid]
        );
        
        return newMovie[0];
        
    }

    static async delete({ id }) {
        const [movie] = await connection.query(`
            SELECT title, year, director, duration, poster, rate FROM movie 
            WHERE BIN_TO_UUID(id) = ?;`,
            [id]
        );
        await connection.query(`
            DELETE FROM movie WHERE BIN_TO_UUID(id) = ?;`,
            [id]
        );
        return movie;
    }

    static async update({ id, result }) {
        console.log(id);        
        console.log(result.data);
        let setSentence = '';
        let valuesSentence = [];
        Object.keys(result.data).forEach((keyData, i) => {
            if(i == Object.keys(result.data).length - 1) {
                setSentence += `${keyData} = ?`;
                valuesSentence.push(result.data[keyData]);
                valuesSentence.push(id);
                return;
            }
            setSentence += `${keyData} = ?, `;
            valuesSentence.push(result.data[keyData]);
        })       
        
        const resultSQL = await connection.query(`
            UPDATE movie
            SET ${setSentence}
            WHERE BIN_TO_UUID(id) = ?;`,
            valuesSentence

        );

        console.log(resultSQL);
        
    }
}