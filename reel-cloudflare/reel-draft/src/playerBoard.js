
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './playerBoard.css';


function PlayerBoard({
    player,
    handleButtonClick,
    currentPlayerNum,
    genreMapping,
    color,
    year,
    pickedMovies,
    hoveredGenreGroup,
    genreMovies,
    handleMouseEnter,
    genreData,
    roundCountWord,
    genreWord,
    totalInputs,
    players,
    genreGroup,
    blockbusterMovies,
    fetchedMovies,
    disabledIsAll,
    setDisabledIsAll
}) {
    const isActive = currentPlayerNum === player.number;
    const [inputValues, setInputValues] = useState({});
    const [searchQueries, setSearchQueries] = useState({});
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [clickedButtons, setClickedButtons] = useState({});
    const [permanentlyDisabledInputs, setPermanentlyDisabledInputs] = useState({});
    const navigate = useNavigate();
    const moviesToAppear = useMemo(() => genreMovies.slice(0, 100), [genreMovies]);

    const handleInputChange = (genreGroup, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [genreGroup]: value
        }));
    };

    const handleItemClick = (movie) => {
        const movieTitle = movie.title;
        if (hoveredGenreGroup) {
            setInputValues(prevState => {
                const newState = { ...prevState, [hoveredGenreGroup]: movieTitle };
                return newState;
            });
            handleInputChange(genreGroup, movieTitle);
            setSearchQueries(prevState => {
                const newState = { ...prevState, [hoveredGenreGroup]: movieTitle };
                return newState;
            });
        }
    };

    const handleSearchChange = (e, genreGroup) => {
        const { value } = e.target;
        setInputValues(prevState => ({
            ...prevState,
            [genreGroup]: value
        }));
        setSearchQueries(prevState => ({
            ...prevState,
            [genreGroup]: value
        }));
    };

    const handleKeyDown = (e, genreGroup) => {
        if (e.key === 'Enter') {
            handleButtonClickInternal(e, genreGroup);
        }
    };

    useEffect(() => {
        if (hoveredGenreGroup) {
            const searchString = searchQueries[hoveredGenreGroup];
            if (typeof searchString === 'string') {
                const filtered = moviesToAppear.filter(movie =>
                    movie.title.toLowerCase().includes(searchString.toLowerCase())
                );
                setFilteredMovies(filtered);
            } else {
                setFilteredMovies([]);
            }
        }
    }, [hoveredGenreGroup, searchQueries]);

    // Define a state to track clicked state for each genre group
    const [clickedGenres, setClickedGenres] = useState({});

    // Inside handleButtonClickInternal function, update clicked state for the current genre group
    const handleButtonClickInternal = (e, genreGroup) => {
        if (!inputValues[genreGroup]) return;

        handleButtonClick(player.name, genreGroup, inputValues[genreGroup]);
        
        setPermanentlyDisabledInputs(prevState => ({
            ...prevState,
            [genreGroup]: true
        }));
        setInputValues(prevState => {
            const newState = {};
            for (const key in prevState) {
                if (permanentlyDisabledInputs[key] || key === genreGroup) {
                    newState[key] = prevState[key];
                } else {
                    newState[key] = '';
                }
            }
            return newState;
        });
        setSearchQueries(prevState => ({
            ...prevState,
            [genreGroup]: ''
        }));
        setClickedButtons(prevState => ({
            ...prevState,
            [genreGroup]: true
        }));
        // Update clicked state for the current genre group
        setClickedGenres(prevState => ({
            ...prevState,
            [genreGroup]: true
        }));

    };

    function allBlockbusterMoviesPicked(blockbusterMovies, pickedMovies) {
        let allPicked = true;

        blockbusterMovies.forEach(blockbusterMovie => {
            let found = false;

            pickedMovies.forEach(pickedMovie => {
                if (blockbusterMovie.title === pickedMovie.movieTitle) {
                    found = true;
                }
            });
            if (!found) {
                allPicked = false;
            }
        });
        return allPicked;
    }
    
    const allPicked = allBlockbusterMoviesPicked(blockbusterMovies, pickedMovies);

    const isAnyInputFilled = Object.values(inputValues).some(value => value);

    const isInputDisabled = (genreGroup) => {
        return !isActive || permanentlyDisabledInputs[genreGroup];
    };

    const playersSelectedMovies = {};
    let totalLength = 0;

    players.forEach(player => {
        const { name, selectedMovies } = player;
        const playerMovies = Array.isArray(selectedMovies) ? selectedMovies.map(movie => ({ playerName: name, ...movie })) : [];
        playersSelectedMovies[name] = playerMovies;

        totalLength += playerMovies.length;

        // Add Blockbuster: N/A if all Blockbuster movies are picked
        if (allPicked && !playerMovies.some(movie => movie.genreGroup === 'Blockbuster')) {
            playersSelectedMovies[name].push({ playerName: name, genreGroup: 'Blockbuster', movieTitle: 'N/A' });
        }
    });


    
    let totalMovies = 0; // Define totalMovies variable
    
    for (const player in playersSelectedMovies) {
        if (playersSelectedMovies.hasOwnProperty(player)) {
            totalMovies += playersSelectedMovies[player].length;
        }
    }

    const countDisabledInputsForPlayerFn = () => {
        let count = 0;
        // Loop through each genre group
        Object.entries(genreData).forEach(([genreGroup, genres]) => {
            // Increment count if the genreGroup is permanently disabled or it's the Blockbuster genre and allPicked is true
            if (permanentlyDisabledInputs[genreGroup] || (genreGroup === 'Blockbuster' && allPicked)) {
                count++;
            }
        });
        return count;
    };

    // Count disabled inputs for the current player
    const disabledInputsCountForPlayer = countDisabledInputsForPlayerFn();


    useEffect(() => {
        // Update the state of isDisabledAll whenever disabledInputsCountForPlayer changes
        const isDisabledAll = disabledInputsCountForPlayer === 6;
        setDisabledIsAll(isDisabledAll);

        // Log inside useEffect to verify state update
    }, [disabledInputsCountForPlayer]);

    // Log after the useEffect to see the state change (may not reflect the latest change immediately)
    useEffect(() => {
    }, [disabledIsAll]);

    // const gameEnd = () => totalLength === totalInputs || disabledIsAll;
    const gameEnd = () => totalMovies === totalInputs;

    if (gameEnd()) {
        navigate('/scoring', { state: { playersSelectedMovies, genreData, players, year, genreMapping, fetchedMovies } });
    }

    return (
        <div className={`player-board ${isActive ? 'active' : 'inactive'}`} style={{ '--player-color': color }}>
            <div className='round-header'>
                <div className='marquee-wrapper'>
                    <div className='marquee'>
                        <h2 className='marquee-text'>Round {roundCountWord} of {genreWord}</h2>
                    </div>
                </div>
            </div>
            <h2 className='player-name-header'>{player.name}</h2>
            <div className='boards-container'>
                <div className='container-set'>
                    <h2 className='movies-box-header'> Movie Picks</h2>
                    <div className='movie-list-holder'>
                        {isAnyInputFilled && (
                            <div className="overlay"></div>
                        )}
                        <div className='movie-dropdown-holder'>
                            <div className="movie-set-proof" onMouseEnter={() => handleMouseEnter(genreGroup)}>
                                <ul className="movie-list" data-genre-group={genreGroup}>
                                    {moviesToAppear.map(movie => (
                                        <li
                                            className={`set-movie-li ${pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) ? 'greyed-out' : ''}`}
                                            key={`${movie.id}-${movie.title}`}
                                            onClick={!isInputDisabled(genreGroup) && !clickedButtons[genreGroup] ? () => handleItemClick(movie) : null}
                                            style={{ pointerEvents: (pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) || isInputDisabled(genreGroup) || clickedButtons[genreGroup]) ? 'none' : 'auto' }}
                                        >
                                            {movie.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="pb-table" border="1">
                    <thead>
                        <tr>
                            <th className='th-genre'>Genre</th>
                            <th className='th-movie-title'>Movie</th>
                            <th className='th-confirm'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(genreData).map(([genreGroup, genres]) => (
                            <tr key={genreGroup}>
                                <td className='genreGroup'>{genreGroup}</td>
                                <td className={`selection-cell ${((genreGroup === 'Blockbuster' && allPicked) || isInputDisabled(genreGroup)) ? 'done' : ''}`}>

                                    {genreGroup === 'Blockbuster' && allPicked ? ( 
                                        <span className='span'>N/A</span>
                                    ) : (
                                        <div
                                            className={`input-wrapper ${hoveredGenreGroup === genreGroup && !clickedButtons[genreGroup] ? 'dropdown-content show' : ''}`}
                                            onMouseEnter={() => handleMouseEnter(genreGroup)}
                                            data-genre={genreGroup}
                                        >
                                            <input
                                                type="text"
                                                value={inputValues[genreGroup] || searchQueries[genreGroup] || ''}
                                                onChange={!isInputDisabled(genreGroup) && !clickedButtons[genreGroup] ? (e) => handleSearchChange(e, genreGroup) : null}
                                                onKeyDown={!isInputDisabled(genreGroup) && !clickedButtons[genreGroup] ? (e) => handleKeyDown(e, genreGroup) : null}
                                                disabled={isInputDisabled(genreGroup) || clickedButtons[genreGroup] || (genreGroup === 'Blockbuster' && allPicked)}
                                            />
                                            {hoveredGenreGroup === genreGroup && !clickedButtons[genreGroup] && inputValues[genreGroup]?.length > 1 && filteredMovies.length > 0 && (
                                                <ul className='filteredMovies'>
                                                    {filteredMovies.map(movie => (
                                                        <li
                                                            key={movie.title}
                                                            onClick={() => handleItemClick(movie)}
                                                            className={pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) ? 'greyed-out' : ''}
                                                            style={{ pointerEvents: pickedMovies.some(pickedMovie => pickedMovie.movieTitle === movie.title) ? 'none' : 'auto' }}
                                                        >
                                                            {movie.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className='button-div'>
                                    <button
                                        onClick={(e) => handleButtonClickInternal(e, genreGroup)}
                                        disabled={isInputDisabled(genreGroup) || (genreGroup === 'Blockbuster' && allPicked)}
                                    >
                                        {genreGroup === 'Blockbuster' && allPicked ? "Locked IN" : clickedGenres[genreGroup] ? "Locked IN" : "Confirm"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );    
}


export default PlayerBoard;