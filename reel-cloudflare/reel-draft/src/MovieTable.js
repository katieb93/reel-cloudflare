import React from 'react';

const MovieTable = ({ sortedPlayers, selected, sanitizeGenre, getPlayerStyle, rankedPlayers }) => {
    // Object to store movie data organized by player and genre
    const tableData = {};

    // Organize movie data by player and genre
    sortedPlayers.forEach((playerName) => {
        const movies = selected[playerName];
        if (movies && Array.isArray(movies)) {
            movies.forEach((movie) => {
                if (!tableData[movie.genreGroup]) {
                    tableData[movie.genreGroup] = {};
                }
                if (!tableData[movie.genreGroup][playerName]) {
                    tableData[movie.genreGroup][playerName] = [];
                }
                tableData[movie.genreGroup][playerName].push(movie.movieTitle);
            });
        }
    });

    const genres = Object.keys(tableData);
    const players = sortedPlayers;

    // Check if the number of players is greater than 7
    const shouldSwitchLayout = players.length > 7;

    // Generate table rows
    const rows = shouldSwitchLayout ? players.map((playerName) => {
        const cells = genres.map((genre) => {
            const sanitizedGenre = sanitizeGenre(genre);
            const movies = tableData[genre][playerName] || [];
            return (
                <td key={`${sanitizedGenre}-${playerName}`} className={`player-cell genre ${sanitizedGenre}`} style={getPlayerStyle(playerName)}>
                    {movies.join(', ')}
                </td>
            );
        });

        const { rankWord } = rankedPlayers[playerName];
        return (
            <tr key={playerName}>
                <td className="player-column" style={getPlayerStyle(playerName)}>
                    <div>{playerName}</div>
                    <div className="rank-word">{rankWord}</div>
                </td>
                {cells}
            </tr>
        );
    }) : genres.map((genre) => {
        const sanitizedGenre = sanitizeGenre(genre);
        const cells = players.map((playerName) => {
            const movies = tableData[genre][playerName] || [];
            return (
                <td key={`${sanitizedGenre}-${playerName}`} className={`player-cell ${sanitizedGenre}`} style={getPlayerStyle(playerName)}>
                    {movies.join(', ')}
                </td>
            );
        });

        return (
            <tr key={genre}>
                <td className={`genre-column ${sanitizedGenre}`} style={{ backgroundColor: 'black', color: 'white' }}>{genre}</td>
                {cells}
            </tr>
        );
    });

    // Generate table
    return (
        <div className='back-wrap'>
            <table className="copied-table">
                {shouldSwitchLayout ? (
                    <thead className="thead-row genre-define">
                        <tr>
                            <th className="copied-black-cell"></th>
                            {genres.map((genre) => {
                                const sanitizedGenre = sanitizeGenre(genre);
                                return (
                                    <th key={sanitizedGenre} className={sanitizedGenre} style={{ backgroundColor: 'black', color: 'white' }}>{genre}</th>
                                );
                            })}
                        </tr>
                    </thead>
                ) : (
                    <thead className="thead-row">
                        <tr>
                            <th className="copied-black-cell"></th>
                            {players.map((playerName) => (
                                <th key={playerName} style={getPlayerStyle(playerName)}>
                                    <div>{playerName}</div>
                                    <div className="rank-word">{rankedPlayers[playerName].rankWord}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
};

export default MovieTable;
