<div className='movie-dropdown-holder'>
{(!hoveredGenreGroup || hoveredGenreGroup === 'Wildcard') && (
    <ul className='movie-list'>
        {genreData['Wildcard'].map((movie, index) => (
            <li key={index} onClick={() => handleMovieSelect('Wildcard', movie)}>
                {movie}
            </li>
        ))}
    </ul>
)}
{hoveredGenreGroup && hoveredGenreGroup !== 'Wildcard' && (
    <ul className='movie-list'>
        {filteredMovies.map(movie => (
            <li
                key={movie.title}
                onClick={() => handleMovieSelect(hoveredGenreGroup, movie.title)}
                className={pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) ? 'greyed-out' : ''}
                style={{ pointerEvents: pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) ? 'none' : 'auto' }}
            >
                {movie.title}
            </li>
        ))}
    </ul>
)}
</div>