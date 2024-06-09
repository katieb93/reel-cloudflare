import { useState } from 'react';

const useGenreIds = () => {
    const [genreIds, setGenreIds] = useState({});

    const genreData = {
        'Drama': ['drama'],
        'Comedy_Animation': ['comedy', 'animation'],
        'Action_Horror_Thriller': ['action', 'horror', 'thriller'],
        'Sci-Fi_Fantasy': ['science fiction', 'fantasy'],
        'Blockbuster': ['blockbuster'],
        'Wildcard': ['wildcard']
    };

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

    // Define genre IDs directly without useEffect
    const orderedGenres = Object.keys(genreData); // Get genre names in the order they are defined
    const idsObject = {};

    orderedGenres.forEach(genre => {
        // Map genre names to their corresponding IDs
        const genreIdsArray = genreData[genre].map(genreName => genreMapping[genreName]);
        // Join multiple genre IDs with a separator if there are multiple values
        idsObject[genre] = genreIdsArray.length > 1 ? genreIdsArray.join('|') : genreIdsArray[0];
    });

    // Set genreIds state once during initialization
    if (Object.keys(genreIds).length === 0) {
        setGenreIds(idsObject);
    }

    return genreIds;
}

export default useGenreIds;
