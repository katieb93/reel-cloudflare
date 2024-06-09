
import React from 'react';
// import './getMovieSet.css';

const MovieSet = ({ moviesOverall, hoveredGenreGroup, onItemClick, handleMouseEnter, handleMouseLeave, pickedMovies }) => {
    // Filter movies based on genreGroup
    const genreGroup = hoveredGenreGroup;

    // Function to handle the click event on a movie item
    const handleItemClick = (movie) => {
        // Call the onItemClick function if provided, passing the movie object
        if (onItemClick) {
            onItemClick(movie);
        }
    };

    // Function to handle mouse enter event
    const handleMouseEnterWrapper = (e) => {
        // Call the handleMouseEnter function if provided
        if (handleMouseEnter) {
            handleMouseEnter(e);
        }
    };

    // Function to handle mouse leave event
    const handleMouseLeaveWrapper = (e) => {
        // Call the handleMouseLeave function if provided
        if (handleMouseLeave) {
            handleMouseLeave(e);
        }
    };

    return (
        <div className="movie-set-proof" onMouseEnter={handleMouseEnterWrapper} onMouseLeave={handleMouseLeaveWrapper}>
            <ul className="movie-list" data-genre-group={genreGroup}>
                {/* Map through the moviesOverall array and render each movie item */}
                {moviesOverall.map(movie => (
                    <li
                        className={`set-movie-li ${pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) ? 'greyed-out' : ''}`}
                        key={`${movie.id}-${movie.title}`}
                        onClick={() => handleItemClick(movie)} // Pass the movie object to the handleItemClick function
                        style={{ pointerEvents: pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) ? 'none' : 'auto' }}
                    >
                        {movie.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieSet;
