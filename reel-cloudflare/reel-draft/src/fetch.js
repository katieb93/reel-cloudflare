import axios from 'axios';

const assignRanks = (movies) => {
    const rankByCriterion = (criterion, rankProperty) => {
        movies.sort((a, b) => b[criterion] - a[criterion]);
        movies.forEach((movie, index) => {
            movie[rankProperty] = index + 1; // Add 1 to index since ranks start from 1
        });
    };

    rankByCriterion('voteCount', 'voteCountRank');
    rankByCriterion('voteAverage', 'voteAverageRank');
    rankByCriterion('popularity', 'popularityRank');
    rankByCriterion('revenue', 'revenueRank');

    return movies;
};

const FetchMovies = async (year, genreIds, totalPages = 5) => {
    const API_ENDPOINT = "https://api.themoviedb.org/3/discover/movie";
    // const API_KEY = "00e84fedac993febd23691cec73cc937";

    const moviesOverall = [];
    const addedMovies = new Set();

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        let url = `${API_ENDPOINT}?api_key=${API_KEY}&primary_release_year=${year}&sort_by=revenue.desc&page=${currentPage}`;

        // Check if "blockbuster" genre is present in genreIds
        if (genreIds.includes('blockbuster')) {
            // Fetch only the top 20 movies (first page)
            url += `&region=United%20States&page=1`;
        } else if (genreIds.includes('wildcard')) {
            // Fetch movies without specifying any genre
            url += `&region=United%20States`;
        } else {
            // Fetch movies with specified genres
            url += `&with_genres=${genreIds.join('|')}&region=United%20States`;
        }

        try {
            const response = await axios.get(url);

            if (response.status === 200) {
                const movieData = response.data.results;

                for (const movie of movieData) {
                    if (!addedMovies.has(movie.title)) {
                        moviesOverall.push({
                            title: movie.title,
                            popularity: movie.popularity,
                            voteCount: movie.vote_count,
                            voteAverage: movie.vote_average,
                            revenue: movie.revenue, // Ensure revenue is included in the response
                            genreIds: genreIds.join(', '), // Combine genreIds into a string
                        });
                        addedMovies.add(movie.title);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            // You might choose to throw an error here or handle it in another way
        }
    }

    return assignRanks(moviesOverall).slice(0, 100);
};

export default FetchMovies;
