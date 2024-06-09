import axios from 'axios';
import { useState, useEffect } from 'react';

const useFetchMovies = (year, genreIds) => {
    const [movies, setMovies] = useState({});

    // const API_KEY = process.env.REACT_APP_API_KEY; // Access the environment variable or provide a fallback

    // const API_KEY = process.env.REACT_APP_API_KEY;

    const API_KEY = '8ebcb38ebf496b8f2ea65f1d40174e1d';



    useEffect(() => {
        const fetchData = async () => {
            const allGenreMovies = {}; // Object to store all movies for each genre

            console.log("scar BLANK")
        
            for (const genre in genreIds) {
                if (genreIds.hasOwnProperty(genre)) {
                    const genreMovies = []; // Array to store movies for the current genre
                    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}`;
        
                    if (genre === 'Blockbuster' && genreIds[genre] === 'blockbuster') {
                        url += `&sort_by=revenue.desc&region=United%20States`;
                    } else if (genre === 'Wildcard' && genreIds[genre] === 'wildcard') {
                        url += `&sort_by=revenue.desc&region=United%20States`;
                    } else if (typeof genreIds[genre] === 'string') {
                        const genreIdsString = genreIds[genre];
                        url += `&sort_by=revenue.desc&with_genres=${genreIdsString}&region=United%20States`;
                    }
        
                    // try {
                        const genreMoviesPerPage = []; // Array to store movies fetched from each page
        
                        for (let currentPage = 1; currentPage <= 40; currentPage++) {
                            const response = await axios.get(`${url}&page=${currentPage}`);
                            if (response.status === 200) {
                                const movieData = response.data.results;
        
                                // Format movie data and push it to genreMoviesPerPage
                                movieData.forEach(movie => {
                                    genreMoviesPerPage.push({
                                        title: movie.title,
                                        popularity: movie.popularity,
                                        voteCount: movie.vote_count,
                                        voteAverage: movie.vote_average,
                                        genreId: movie.genre_ids,
                                        revenue: movie.revenue, // Assuming the API returns revenue
                                    });
                                });
                            } else {
                                // Handle error or retry logic if the request fails
                            }
                        }
        
                        genreMovies.push(...genreMoviesPerPage); // Combine movie data from all pages for this genre
                        allGenreMovies[genre] = genreMovies; // Store the combined list of movies for this genre
                    // } catch (error) {
                    //     console.error("Error fetching data:", error);
                    //     // Handle error appropriately
                    // }
                }
            }
        
            // Function to sort movies array by a specific property
            const sortByProperty = (movies, property) => {
                return movies
                    .map((movie, index) => ({ ...movie, index: index + 1 }))
                    .sort((a, b) => a[property] - b[property]);
            };
        
            // Add index as a separate property
            const withRankProperty = (movies) => {
                return movies.map((movie, index) => ({
                    ...movie,
                    rank: index + 1
                }));
            };

            const organizeByAllCriteria = (allGenreMovies) => {
                const organizedGenres = {};
                for (const genre in allGenreMovies) {

                    const sortedByPopularity = sortByProperty(allGenreMovies[genre], 'popularity');
                    const sortedByVoteCount = sortByProperty(allGenreMovies[genre], 'voteCount'); // Reverse the order
                    const sortedByVoteAverage = sortByProperty(allGenreMovies[genre], 'voteAverage'); // Reverse the order
                    const sortedByRevenue = sortByProperty(allGenreMovies[genre], 'revenue').reverse();
                    
                    const moviesWithRanks = allGenreMovies[genre].map((movie, index) => ({
                        ...movie,
                        ranks: {
                            byPopularity: sortedByPopularity.findIndex(item => item.title === movie.title) + 1,
                            byVoteCount: sortedByVoteCount.findIndex(item => item.title === movie.title) + 1,
                            byVoteAverage: sortedByVoteAverage.findIndex(item => item.title === movie.title) + 1,
                            byRevenue: sortedByRevenue.findIndex(item => item.title === movie.title) + 1,
                        }
                    }));
                    
                    organizedGenres[genre] = {
                        movies: moviesWithRanks,
                    };
                }
                return organizedGenres;
            };
        
            const organizedGenres = organizeByAllCriteria(allGenreMovies);
            setMovies(organizedGenres);
        };

        fetchData();
    }, [year, genreIds]);
    return movies; // Return the fetched and processed movies
};

export default useFetchMovies;
