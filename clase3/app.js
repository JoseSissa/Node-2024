import express, { json } from 'express';
import { randomUUID } from 'node:crypto';
import { getJSON } from './utils/utils.js';

import { validateMovie, validatePartialMovie } from './schemas/movies.js';
const MOVIES = getJSON('../movies.json');

const app = express();

// Middleware para parsear el body de la petición
app.use(json());

app.disable('x-powered-by'); // disable express powered by header

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// métodos normales: GET, POST, HEAD
// métodos complejos: PUT, PATCH, DELETE
// CORS PRE-FLIGHT se le agrerga el método OPTIONS

app.get('/movies', (req, res) => {
    // CORS
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    const { genre } = req.query;
    if(genre) {
        const filteredMovies = MOVIES.filter(
            movie => {
                return movie.genre.some(                    
                    g => {
                        return g.toLowerCase() === genre.toLowerCase();
                    } 
                );
            }
        );
        return res.json(filteredMovies);
    }
    res.json(MOVIES)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = MOVIES.find(movie => movie.id === id);
    if (!movie) {
        res.status(404).send('Movie not found');
        return;
    }
    res.json(movie)
})

app.post('/movies', (req, res) => {    
    const result = validateMovie(req.body)

    if(result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = {
        id: randomUUID(),
        ...result.data
    }

    MOVIES.push(newMovie)

    res.status(201).json(newMovie);
})

app.delete('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    const { id } = req.params;
    const movieIndex = MOVIES.findIndex(movie => movie.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    MOVIES.splice(movieIndex, 1);
    return res.json({ message: 'Movie deleted successfully' });
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
    if(result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    
    const { id } = req.params;
    const movieIndex = MOVIES.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    const updatedMovie = {
        ...MOVIES[movieIndex],
        ...result.data
    }

    MOVIES[movieIndex] = updatedMovie;

    return res.json(updatedMovie);
})

app.options('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    res.send(200)
})

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});