import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './playersInOrder.css';

const playerColors = ['#1D98BA', '#F2A815', '#FF562F', '#60851C', '#FFC1C6', '#F78D37', '#B6ABE3', '#65CBD0', '#FED070', '#ACCE82']; // Sample colors

function shuffleArray(array) {
    // Using Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getOrdinalNumber(number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function PlayersInOrder() {
    const location = useLocation();
    const gameData = location.state.formData;
    const year = gameData.formData.year;
    const players = gameData.formData.players;
    let playerNames = gameData.playerNames;

    const navigate = useNavigate();

    // Shuffle the playerNames array
    playerNames = shuffleArray(playerNames);

    // Assign colors to players
    const playerData = playerNames.map((name, index) => ({
        name,
        number: index + 1,
        color: playerColors[index % playerColors.length], // Assign player color
    }));


    const handlePlayClick = () => {
        const shuffledPlayerNames = shuffleArray(playerNames);

        navigate('/getListOfMovies', { state: { shuffledPlayerNames, playerData, year } });
    };

    return (
        <div className='bang'>
            <div className='players-collected-box'>
                <h2 className='draft'>Draft Order</h2>
                {/* <p>Year: {year}</p> */}
                <p className='rando'>It’s randomly selected, we promise</p>
                {/* <p>Number of Players: {players}</p> */}
                <div className='list-div'>
                    <ul className='list'>
                        {playerNames.map((name, index) => (
                            <li key={index}>
                                <div className="color-box" style={{ backgroundColor: playerColors[index % playerColors.length] }}>
                                    <span className="ordinal">{getOrdinalNumber(index + 1)}</span> {/* Use getOrdinalNumber */}
                                </div>
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="confirm-button" onClick={handlePlayClick}>Play</button>
            </div>
        </div>
    );
}

export default PlayersInOrder;
