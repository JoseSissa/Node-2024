import zod from 'zod';

const movieSchema = zod.object({
    title: zod.string({
        message: 'Title must be a string'
    }),
    year: zod.number().int().positive().min(1900).max(2024),
    director: zod.string(),
    duration: zod.number().int().positive(),
    poster: zod.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: zod.array(
        zod.enum(['Action', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller']),
        {
            required_error: 'Genre is required',
            invalid_type_error: 'Genre must be an array of strings'
        }
    ),
    rate: zod.number().min(0).max(10).default(5),
});

export function validateMovie(object) {
    return movieSchema.safeParse(object);
}

export function validatePartialMovie(object) {
    // Con el partial() nos aseguramos de que solo se validan las propiedades que se especifican en el objeto
    // Si el objeto tiene solo una propiedad para validar, la valida e ignora las demás 
    return movieSchema.partial().safeParse(object);
}