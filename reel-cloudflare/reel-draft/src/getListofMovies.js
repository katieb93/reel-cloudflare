
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ApiData from './apiData';
import PlayerBoard from './playerBoard';
import './listOfMovies.css';
import { toWords } from 'number-to-words';
import VideoPlayer from './video';
import useFetchMovies from './fetchMovies';
import useGenreIds from './useGenreIds'; // Path to the custom hook

const genreData = {
    'Drama': ['drama'],
    'Comedy / Animation': ['comedy', 'animation'],
    'Action / Horror / Thriller': ['action', 'horror', 'thriller'],
    'Sci-Fi / Fantasy': ['science fiction', 'fantasy'],
    'Blockbuster': ['blockbuster'],
    'Wildcard': ['wildcard']
};

const ListOfMovies = () => {
    const genreMapping = {
        drama: 18,
        comedy: 35,
        animation: 16,
        action: 28,
        horror: 27,
        thriller: 53,
        'science fiction': 878,
        fantasy: 14,
        blockbuster: 'blockbuster',
        wildcard: 'wildcard'
    };

    

    const location = useLocation();
    const year = location.state.year;
    const initialPlayers = location.state.playerData;

    const [players, setPlayers] = useState(initialPlayers);
    const [confirmationStatus, setConfirmationStatus] = useState({});
    const [pickedMovies, setPickedMovies] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [moviesOverall, setMoviesOverall] = useState([]);
    const [hoveredGenreGroup, setHoveredGenreGroup] = useState(null);
    const [genreMovies, setGenreMovies] = useState([]);
    const [currentPlayerNum, setCurrentPlayerNum] = useState(players[0].number);
    const [firstPlayerClicks, setFirstPlayerClicks] = useState(0);
    const [lastPlayerClicks, setLastPlayerClicks] = useState(0);
    const [isForwardRound, setIsForwardRound] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [evenRound, setEvenRound] = useState(false);

    const numOfConfirms = useRef(0);
    const firstPlayer = players[0];
    const lastPlayer = players[players.length - 1];
    const firstPlayerNum = firstPlayer.number;
    const lastPlayerNum = lastPlayer.number;
    const numOfGenre = Object.keys(genreData).length;
    const numOfPlayers = players.length;
    const [showPlayerBoards, setShowPlayerBoards] = useState(false); // State to control player board visibility

    // Call the custom hooks
    const genreIds = useGenreIds(); // Call the hook here
    const fetchedMovies = useFetchMovies(year, genreIds); // Use the custom hook to fetch movies
    const [disabledIsAll, setDisabledIsAll] = useState(false);


    const [playersSelectedMovies, setPlayersSelectedMovies] = useState({}); // State for playersSelectedMovies

    useEffect(() => {
        const playerIndex = players.findIndex(player => player.number === currentPlayerNum);
        setIsActive(playerIndex !== -1);
    }, [currentPlayerNum, players]);

    const swipeDirection = isForwardRound ? 'forward' : 'backward';

    const [blockbusterMovies, setBlockbusterMovies] = useState([]);

    useEffect(() => {
        if (!dataFetched) {
            (async () => {
                const movies = await ApiData(year, [], 1);
                setMoviesOverall(movies);
                setDataFetched(true);
            })();
        }
    }, [dataFetched, year]);

    useEffect(() => {
        const fetchBlockbusterMovies = async () => {
            const blockbusterMovies = await ApiData(year, ['blockbuster']);
            setBlockbusterMovies(blockbusterMovies);
        };

        fetchBlockbusterMovies();
    }, [year]);

    const [roundCount, setRoundCount] = useState(1);

    const handleButtonClick = (playerName, genreGroup, movieTitle) => {

        numOfConfirms.current += 1;

        setConfirmationStatus(prevStatus => ({
            ...prevStatus,
            [playerName]: true
        }));

        setPickedMovies(prevMovies => [
            ...prevMovies,
            { playerName, genreGroup, movieTitle }
        ]);

        if (isForwardRound) {
            if (currentPlayerNum < lastPlayerNum) {
                setCurrentPlayerNum(currentPlayerNum + 1);
            } else {
                setLastPlayerClicks(prevClicks => {
                    const newClicks = prevClicks + 1;
                    if (newClicks === 1) {
                        setEvenRound(true);
                        setRoundCount(prevCount => prevCount + 1);
                    }
                    if (newClicks === 2 ) {
                        setIsForwardRound(false);
                        setCurrentPlayerNum(currentPlayerNum - 1);
                        return 0;
                    }
                    return newClicks;
                });
            }
        } else {
            if (currentPlayerNum > firstPlayerNum) {
                setCurrentPlayerNum(currentPlayerNum - 1);
            } else {
                setFirstPlayerClicks(prevClicks => {
                    const newClicks = prevClicks + 1;
                    if (newClicks === 1) {
                        setEvenRound(false);
                        setIsForwardRound(true);
                        setRoundCount(prevCount => prevCount + 1);
                        return 0;
                    }
                    return newClicks;
                });
            }
        }

        const updatedPlayers = players.map(player => {
            if (player.name === playerName) {
                const selectedMovies = Array.isArray(player.selectedMovies)
                    ? [
                        ...player.selectedMovies,
                        { genreGroup, movieTitle }
                    ]
                    : [{ genreGroup, movieTitle }];

                return {
                    ...player,
                    selectedMovies
                };
            }
            return player;
        });

        setPlayers(updatedPlayers);

        // Log the movies confirmed by all players
        if (numOfConfirms.current === numOfPlayers * numOfGenre) {
            const moviesConfirmedByAll = pickedMovies.reduce((acc, movie) => {
                const count = acc[movie.genreGroup + movie.movieTitle] || 0;
                return {
                    ...acc,
                    [movie.genreGroup + movie.movieTitle]: count + 1
                };
            }, {});

            const finalMovies = Object.entries(moviesConfirmedByAll)
                .filter(([_, count]) => count === numOfPlayers)
                .map(([key]) => {
                    const [genreGroup, movieTitle] = key.split(movieTitle);
                    return { genreGroup, movieTitle };
                });
        }
    };

    const handleMouseEnter = async (genreGroup) => {
        setHoveredGenreGroup(genreGroup);
        const genres = genreData[genreGroup];

        if (!genres) {
            return;
        }

        const genreIds = genres.map(genre => genreMapping[genre]);
        const movies = await ApiData(year, genreIds, 1);

        setGenreMovies(movies);
    };

    const handleMouseLeave = () => {
        setGenreMovies([]);
    };

    const calculateTotalInputs = () => {
        return numOfPlayers * numOfGenre;
    };

    const totalInputs = calculateTotalInputs();

    const genreDataLength = Object.keys(genreData).length;
    const roundCountWord = toWords(roundCount);
    const genreWord = toWords(genreDataLength);
    const [allSelectedMovies, setAllSelectedMovies] = useState([]);
    const [showVideo, setShowVideo] = useState(true); // Initially show the video

    const xClick = () => {
        setShowVideo(false);
        setShowPlayerBoards(true); // Show player boards after video finishes
    }; 

    return (
        <div className="center-container">
            {showVideo && ( // Conditionally render the video player and "X" button
                <>
                    <div className='all-video'>
                        <div className="x-button" onClick={xClick}>
                            &times;
                        </div>
                        <div className='video'>
                            <VideoPlayer 
                                setShowVideo={setShowVideo}
                            />
                        </div>
                    </div>
                </>
            )}


            {showPlayerBoards && ( // Conditionally render the player boards container
                <div className="player-boards-container">
                    {players.map((player, index) => (
                        <PlayerBoard
                            roundCount={roundCount}
                            key={index}
                            players={players}
                            player={player}
                            currentPlayerNum={currentPlayerNum}
                            handleButtonClick={handleButtonClick}
                            genreMapping={genreMapping}
                            color={player.color}
                            year={year}
                            pickedMovies={pickedMovies}
                            moviesOverall={moviesOverall}
                            hoveredGenreGroup={hoveredGenreGroup}
                            genreMovies={genreMovies}
                            handleMouseEnter={handleMouseEnter}
                            handleMouseLeave={handleMouseLeave}
                            genreData={genreData}
                            isActive={isActive}
                            totalInputs={totalInputs}
                            roundCountWord={roundCountWord}
                            genreWord={genreWord}
                            swipeDirection={swipeDirection}
                            allSelectedMovies={allSelectedMovies}
                            setAllSelectedMovies={setAllSelectedMovies}

                            playersSelectedMovies={playersSelectedMovies} // Pass playersSelectedMovies as a prop
                            disabledIsAll={disabledIsAll}
                            setDisabledIsAll={setDisabledIsAll}

                            genreGroup={hoveredGenreGroup} 
                            blockbusterMovies={blockbusterMovies}
                            fetchedMovies={fetchedMovies}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListOfMovies;