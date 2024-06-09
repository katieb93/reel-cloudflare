


    import React, { useState, useEffect } from 'react';
    import { useLocation } from 'react-router-dom';
    import './scoring.css';
    import 'animate.css';
    import domtoimage from 'dom-to-image-more';
    import reelLogo from './blackReelLogo.svg';
    import MovieTable from './MovieTable';
    // import { getRandomQuote } from './quotesList';
    import colorGif from './colorGif.gif'; // Import the GIF file
    import useGenreIds from './useGenreIds'; // Path to the custom hook
    
    const Scoring = () => {
    
        const rankWords = {
            1: 'Winner',
            2: 'Second Place',
            3: 'Third Place',
            4: 'Fourth Place',
            5: 'Fifth Place',
            6: 'Sixth Place',
            7: 'Seventh Place',
            8: 'Eighth Place',
            9: 'Ninth Place',
            10: 'Tenth Place',
            // Add more as needed
        };
    
        const location = useLocation();
        const selected = location.state.playersSelectedMovies;
        
        const genreIds = useGenreIds(); // Call the hook here
        
        const genreData = location.state.genreData;

        const numberOfGenres = Object.keys(genreData).length;
        const players = location.state.players;
        const year = location.state.year;
        const fetchedMovies = location.state.fetchedMovies;

        const [isVisible, setIsVisible] = useState(false);
        const [isLoadVisible, setIsLoadVisible] = useState(true);
        const [isScoreVisible, setIsScoreVisible] = useState(false);

        const [showPopup, setShowPopup] = useState(false);

    
        useEffect(() => {
            const timer = setTimeout(() => {
                setIsLoadVisible(false);
            }, 10000); // 10000 milliseconds = 10 seconds
        
            // Clean up the timer if the component is unmounted
            return () => clearTimeout(timer);
        }, []);
    
        useEffect(() => {
            if (!isLoadVisible) {
                setIsScoreVisible(true);
            }
        }, [isLoadVisible]);
    

        const getColorWithOpacity = (color) => {
            // Remove '#' from the color string
            color = color.substring(1);
    
            // Convert hexadecimal color to RGB
            const red = parseInt(color.substring(0, 2), 16);
            const green = parseInt(color.substring(2, 4), 16);
            const blue = parseInt(color.substring(4, 6), 16);
    
            // Calculate the color with 20% opacity in RGBA format
            const colorWithOpacity = `rgba(${red}, ${green}, ${blue}, 0.2)`;
    
            return colorWithOpacity;
        };
    
        // Function to get player style with original and 20% opacity colors
        const getPlayerStyle = (playerName) => {
            const player = players.find(player => player.name === playerName);
    
            if (player) {
                return {
                    '--player-color': player.color,
                    '--player-color-opacity': getColorWithOpacity(player.color)
                };
            } else {
                return {};
            }
        };
    
        const sortMoviesByGenre = (movies) => {
            const genreOrder = Object.keys(genreData);
            return movies.sort((a, b) => genreOrder.indexOf(a.genreGroup) - genreOrder.indexOf(b.genreGroup));
        };
    
        const findMovieRank = (selected) => {

            const movieRanks = {};
        
            for (const playerName in selected) {
                const playerMovies = selected[playerName];
                movieRanks[playerName] = {};
        
                for (const movie of playerMovies) {

                    let genreGroup = movie.genreGroup.replace(' / ', '_'); // Replace ' / ' with '_'

                    const movieTitle = movie.movieTitle;

                    let fetchedGenreGroup = genreGroup.replace(' / ', '_'); 

                    if (fetchedMovies[fetchedGenreGroup]) {

                        const genreMovies = fetchedMovies[fetchedGenreGroup];
                        const matchedMovie = genreMovies.movies.find(movie => movie.title === movieTitle);                        

                        if (matchedMovie) {
                            if (!movieRanks[playerName][genreGroup]) {
                                movieRanks[playerName][genreGroup] = [];
                            }
                            movieRanks[playerName][genreGroup].push(matchedMovie);
                        }
                    }
                }
            }
            return movieRanks;
        };

    const extractMovieRanks = (data) => {
        const result = {};
        
        for (const character in data) {
            result[character] = {};
    
            for (const genre in data[character]) {
            result[character][genre] = data[character][genre].map(movie => ({
                title: movie.title,
                movieRankNum: movie.ranks
            }));
            }
        }
        
        return result;
        };

    const movieRanks = findMovieRank(selected);

    const extractedRanks = extractMovieRanks(movieRanks);

    const calculateAverage = (movieRankNum) => {
        const { byPopularity, byVoteCount, byVoteAverage, byRevenue } = movieRankNum;
        const sum = byPopularity + byVoteCount + byVoteAverage + byRevenue;
        return sum / 4;
    };
    
    const calculateAverages = (extractedRanks) => {
        const averages = {};
    
        for (const character in extractedRanks) {
            averages[character] = {};
    
            for (const genre in extractedRanks[character]) {
                averages[character][genre] = extractedRanks[character][genre].map(movie => ({
                    title: movie.title,
                    average: calculateAverage(movie.movieRankNum)
                }));
            }
        }
    
        return averages;
        };
    
    const movieAverages = calculateAverages(extractedRanks);
    const calculatePlayerAverages = (movieAverages) => {

        const playerAverages = {};
        for (const player in movieAverages) {

            const genres = movieAverages[player];
    
            let sum = 0;
            let count = 0;
    
            // Iterate over genres
            for (const genre in genres) {
                // Iterate over movies within each genre
                genres[genre].forEach(movie => {
                    sum += movie.average;
                    count++;
                });
            }

            if (count < numberOfGenres) {
                let remainingGenres = numberOfGenres - count;
                sum += remainingGenres * 0; // Adding zeros doesn't affect the sum
            }

            // Calculate the average
            const average = numberOfGenres === 0 ? 0 : sum / numberOfGenres;

            // Assign the average to the player's name
            playerAverages[player] = average;
        }
        return playerAverages;
    };
    
    const playerAverages = calculatePlayerAverages(movieAverages);
    console.log("MESS", playerAverages)


    const rankPlayers = (playerAverages) => {

        const sortedPlayers = Object.entries(playerAverages).sort((a, b) => b[1] - a[1]);    
        const rankedPlayers = {};
    
        sortedPlayers.forEach(([player, _], index) => {
            const rank = index + 1;
            const rankWord = rankWords[rank] || `${rank}th Place`; // Fallback to a generic rank if not explicitly defined
            rankedPlayers[player] = { rank, rankWord };
        });
        return rankedPlayers;
    };
    
    const rankedPlayers = rankPlayers(playerAverages);
    
    // Check if average ranks are available before rendering
    const areAverageRanksAvailable = Object.values(playerAverages).every(rank => !isNaN(rank) && rank !== Infinity);
    
    if (!areAverageRanksAvailable) {
        return null; // If average ranks are not available, don't render anything
    }
    
    // const sortedPlayers = Object.keys(selected).sort((a, b) => rankedPlayers[b] - rankedPlayers[a]);
    const sortedPlayers = Object.keys(selected).sort((a, b) => rankedPlayers[a].rank - rankedPlayers[b].rank);


    const isNotFirefox = navigator.userAgent.indexOf("Firefox") < 0;

    const copyImageToClipBoardOtherBrowsers = () => {
        if (isNotFirefox) {
            navigator?.permissions
                ?.query({ name: "clipboard-write" })
                .then(async (result) => {
                    if (result.state === "granted") {
                        const type = "image/png";
                        const blob = await snapshotCreator();
                        let data = [new ClipboardItem({ [type]: blob })];
                        navigator.clipboard
                            .write(data)
                            .then(() => {
                                // Success
                            })
                            .catch((err) => {
                                // Error
                                console.error("Error:", err)
                            });
                    }
                });
        } else {
            alert("Firefox does not support this functionality");
        }
    }
    
    const snapshotCreator = () => {
        return new Promise((resolve, reject) => {
            try {
                const scale = 2; // Example scale factor
                const element = document.getElementById('my-draft'); // Assuming 'my-draft' is the id of your .copied-box element
                
                // Adjust the layout size to account for the scaling factor
                const scaledWidth = element.offsetWidth * scale;
                const scaledHeight = element.offsetHeight * scale;
    
                domtoimage
                    .toBlob(element, {
                        height: scaledHeight,
                        width: scaledWidth,
                        style: {
                            transform: "scale(" + scale + ")",
                            transformOrigin: "top left",
                            width: scaledWidth + "px",
                            height: scaledHeight + "px",
                        },
                        filter: node => node.className !== 'copied-button' // Exclude the button from the snapshot
                    })
                    .then((blob) => {
                        resolve(blob);
                    });
            } catch (e) {
                reject(e);
            }
        });
    };

    
    const shareClick = () => {
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 2000); // Hide the popup after 2 seconds (adjust the duration as needed)
        
        copyImageToClipBoardOtherBrowsers();
    };

    const sanitizeGenre = (genre) => {
        return genre.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    };

    const handleShareClick = () => {

        setIsVisible(true);; // Toggle isVisible state
    };
    
    const closeContainer = () => {
        setIsVisible(false);
    };

    return (
        <div className='all'>
                <>
                    {isLoadVisible && (
                        <div className='score-load'>
                            <div className='score-load-container'>
                                <img className="gif-image" src={colorGif} alt="Your GIF" />
                            </div>
                        </div>
                    )}
                </>
                <>
                    {isScoreVisible && (
                        <div className='button-include'>
                            <button className="initiate-share" onClick={() => handleShareClick()}>Share your results!</button>
                            <div className="all-players">
                                {sortedPlayers.map((playerName, index) => { 
                                    const { rankWord } = rankedPlayers[playerName];
                                    const playerStyle = getPlayerStyle(playerName);
                                    const animationDelay = (sortedPlayers.length - index - 1) * 1 + 's'; // Decreasing delay for each player
                                    const animationDuration = sortedPlayers.length * 0.5 + 's'; // Total animation duration
                
                                    return (
                                        <div 
                                            key={playerName} 
                                            className={`player-section animate__animated animate__fadeInLeft animate`}
                                            style={{ 
                                                ...playerStyle, 
                                                animationDelay,
                                                animationDuration
                                            }}
                                        >
                                            <h2 className="player-header">{playerName}</h2>
                                            <h2 className="player-header-rank">{rankWord}</h2>
                
                                            <div className="table-container">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th className='genre-header'>Genre</th>
                                                            <th>Movie</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortMoviesByGenre(selected[playerName]).map((movie, index) => (
                                                            <tr key={index}>
                                                                <td className='genre-column'>{movie.genreGroup}</td>
                                                                <td className='movie-titles'>{movie.movieTitle}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
                {showPopup && (
                        <div className="score-pop">
                            <p className='message'>Copied to keyboard</p>
                        </div>
                )}
                <div className={`copied-holder ${isVisible ? 'visible' : ''}`} style={{ display: isVisible ? 'flex' : 'none' }}>
                    <div className="copied-close-button" onClick={closeContainer}>
                        &times;
                    </div>

                    <div className="copied-button">
                        <button onClick={() => shareClick()}>Share!</button>
                    </div>
        
                    <div className='copied-test'>
                        <div className="copied-box" id='my-draft'>
                            <div className="copied-content">
                                <h2 className='copied-h2'>Our {year} Movie Draft</h2>
                                <div className='copied-play'>
                                    <p className='copied-p'>Come play @</p>
                                    <img src={reelLogo} alt="Reel Logo" />
                                </div>
                            </div>
                            <MovieTable
                                sortedPlayers={sortedPlayers}
                                selected={selected}
                                sanitizeGenre={sanitizeGenre}
                                getPlayerStyle={getPlayerStyle}
                                rankedPlayers={rankedPlayers}
                            />
                        </div>
                    </div>
                </div>
        </div>
    );
    
};

export default Scoring;
