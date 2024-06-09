

import axios from 'axios';

const ApiData = async (year, genreIds) => {


    const API_ENDPOINT = "https://api.themoviedb.org/3/discover/movie";
    const API_KEY = '8ebcb38ebf496b8f2ea65f1d40174e1d';

    const totalPages = 20; // Total number of pages to fetch
    const blockbusterLimit = 20; // Limit for blockbuster movies

    const moviesOverall = [];
    const addedMovies = new Set();
    let blockbusterCount = 0; // Counter for blockbuster movies

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        let url = `${API_ENDPOINT}?api_key=${API_KEY}&primary_release_year=${year}&page=${currentPage}`;

        // Check if "blockbuster" genre is present in genreIds
        if (genreIds.includes('blockbuster')) {
            // Fetch only the top 20 movies (first page)
            url += `&sort_by=revenue.desc&region=United%20States`;
        } else if (genreIds.includes('wildcard')) {
            // Fetch movies without specifying any genre
            url += `&sort_by=vote_count.desc&region=United%20States`;
        } else {
            // Fetch movies with specified genres
            url += `&sort_by=vote_count.desc&with_genres=${genreIds.join('|')}&region=United%20States`;
        }

        try {
            const response = await axios.get(url);

            if (response.status === 200) {
                const movieData = response.data.results;
                for (const movie of movieData) {
                    // Skip movies with 'gif' in the title
                    if (movie.title.toLowerCase().includes('gif')) {
                        continue;
                    }

                    // Limit the number of blockbuster movies
                    if (genreIds.includes('blockbuster') && blockbusterCount >= blockbusterLimit) {
                        break;
                    }

                    if (!addedMovies.has(movie.title)) {
                        moviesOverall.push({
                            title: movie.title,
                            popularity: movie.popularity,
                            voteCount: movie.vote_count,
                            voteAverage: movie.vote_average,
                            genreIds: genreIds.join(', '), // Combine genreIds into a string
                        });
                        addedMovies.add(movie.title);

                        // Increment the blockbuster count if the genre is blockbuster
                        if (genreIds.includes('blockbuster')) {
                            blockbusterCount++;
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            // You might choose to throw an error here or handle it in another way
        }

        // If blockbuster count reaches limit, break the loop
        if (genreIds.includes('blockbuster') && blockbusterCount >= blockbusterLimit) {
            break;
        }
    }

    // If genreIds includes 'blockbuster', sort moviesOverall by vote count
    if (genreIds.includes('blockbuster')) {
        moviesOverall.sort((a, b) => b.voteAverage - a.voteAverage);
    }

    return moviesOverall;
};

export default ApiData;
