var selectedMovies = [];
var selectedMoviesForPlayers = [];

console.log("Selected Movies Set to Arry:", selectedMovies);
var currentPlayerIndex = 0;
var startButtonClicked = false; // Ensure startButtonClicked is declared
var disabledCombinedVariables = []; // Initialize array to store disabled combined variables
var totalConfirmButtons = $(".confirm-button").length; // Total number of confirm buttons
console.log("totalConfirmButtons before doc ready", totalConfirmButtons)
var clickedConfirmButtons = 0; // Initialize the count of clicked confirm buttons

console.log("DisabledCombinedVariables", disabledCombinedVariables)

var defaultPlayerIndex = "defaultPlayerIndex";


$(document).ready(function () {
    
    console.log("CLICKED!")

    $('#play-button').click(function() {
        console.log('we see this')
        $.ajax({
            type: 'POST',
            url: '/play', // Assuming your Flask endpoint is at '/play'
            success: function(response) {
                console.log('Game started with UUID: ' + response);
            },
            error: function(xhr, status, error) {
                alert('Error starting game: ' + error);
            }
        });
    });

    initializeWildcard(defaultPlayerIndex);

    function showScorePopup(playerAverages) {
        var scorePopup = document.getElementById("scorePopup");
        var scoreContent = document.getElementById("scoreContent");
    
        // Clear previous content
        scoreContent.innerHTML = "";
    
        // Add player averages to the pop-up
        var playerAverageElement = document.createElement("p");
        playerAverageElement.textContent = "Player Averages:";
        scoreContent.appendChild(playerAverageElement);
    
        Object.keys(playerAverages).forEach(function(player) {
            var playerAverageElement = document.createElement("p");
            playerAverageElement.textContent = player + ": " + playerAverages[player];
            scoreContent.appendChild(playerAverageElement);
        });
    
        // Show the pop-up
        scorePopup.style.display = "block";
    }
    

    function handleEndOfGame() {
        var selected_movies_game = selectedMoviesForPlayers;
        console.log("selected Movies Games for debugging", selected_movies_game)
    
        $.ajax({
            type: 'POST',
            url: '/get_movie_indices',
            data: JSON.stringify({ selected_movies_game: selected_movies_game }),
            contentType: 'application/json',
            beforeSend: function() {
                console.log("Sending AJAX request...");
            },
            success: function(response) {
                console.log("Received response:", response);
                // Show the score popup with the scores received from the server
                console.log("LONDON TOWN")
                console.log(response.scores)
                showScorePopup(response.average_overall_final_player);
            },
            error: function(xhr, status, error) {
                console.error("Error occurred:", error);
            }
        });
    }
    
    

// Function to fetch the current player from the server and update input state
    async function updateInputState(playerIndex) {
    console.log("updateInputStateworking?", currentPlayerIndex)
        try {
            var response = await $.ajax({
                type: 'GET',
                url: '/gameplay/' + playerIndex,
            });
            
            console.log("UPDATEINPUTSTATE")
            var current_player = response.current_player;
            console.log("current_player", current_player)

            // Hide all tables (replace with specific selectors if needed)
            console.log("Tables belonging to players other than " + current_player + " are hidden.");
            // $('.table-containers').addClass('hidden-table');
            $('.table-containers[data-index="' + current_player + '"]').removeClass('hidden-table');
            console.log("Tables belonging to players other than " + current_player + " are hidden.");

        } catch (error) {
            console.error('Error updating input state:', error);
        }
    }

    async function updateStartInputState() {
        console.log("updateInputStateworking?")
            try {

                var current_player = currentPlayerIndex


                $('.butter').removeClass('orange')
                // $('.table-containers').addClass('hidden-table');
                $('.table-containers[data-index="' + current_player + '"]').removeClass('hidden-table');
                console.log("Could be")
                console.log(current_player)

    
            } catch (error) {
                console.error('Error updating input state:', error);
            }
        }


    function initializeDropdowns(current_player, genre, input_value) {
        var dropdownId = '#' + current_player + '_' + genre + '_results';
    
        console.log("dropdownID", dropdownId);
    
        $.ajax({
            type: 'POST',
            url: '/search_genres',
            data: { input_value: input_value, genre: genre },
            beforeSend: function() {
                console.log("Sending AJAX request...");
            },
            success: function(response) {
                console.log("Response:", response);
                if (response && response.results_html) {
                    console.log("BANG BANG BANG");
                    // Clear existing content (optional)
                    $(dropdownId).empty();
                    // Extract movie titles from HTML string
                    var movieTitles = $(response.results_html);
                    movieTitles.find('p').addClass('actual-title');
    
                    $('.results-dropdown-container').append(movieTitles); // Modified line to append to the container
                    console.log("Movies appended to container.");
                } else {
                    console.log("No movie titles found in the response.");
                }
            }
        });
    }

    function initializeWildcard(currentPlayerIndex) {
        console.log("initializeWildcard is here!");
        var wildcardGenre = "Wildcard";
        console.log("initializeWildcard wildcardGenre is here!", wildcardGenre);
        var dropdownId = '#' + currentPlayerIndex + '_' + wildcardGenre + '_results';
        console.log("initializeWildcard dropdownID is here!", dropdownId);
    
        $.ajax({
            type: 'POST',
            url: '/search_genres_wildcard',
            data: { genre: wildcardGenre }, // Send genre explicitly
            beforeSend: function() {
                console.log("Sending AJAX request...");
            },
            success: function(response) {
                console.log("Response:", response);
                if (response && response.results_html) {
                    console.log("wildcard response in if statement");
                    // Clear existing content (optional)
                    $(dropdownId).empty();
                    var movieTitles = $(response.results_html);
                    movieTitles.find('p').addClass('actual-title');
                    
                    $('.results-dropdown-container').append(movieTitles); // Modified line to append to the container
    
                    console.log("Movies appended to container.");
                }
            }
        });
    }

    $(document).on('focus input change', '.movie-results-input', function () {
        console.log("Focus, input, or change event detected.");
        var player = $(this).data('player');
        var genre = $(this).data('genre');
        var dropdownId = '#' + player + '_' + genre + '_results';
        var input_value = $(this).val();
    
        console.log("Player:", player);
        console.log("Genre:", genre);
        console.log("Dropdown ID:", dropdownId);
        console.log("Input value:", input_value);
    
        // Store the current classes of the dropdown
        var dropdownClasses = $(dropdownId).attr('class');
        console.log("dropdownClasses GO", dropdownClasses)
    
        // Empty both dropdown contents
        $('.results-dropdown').empty();
        console.log("Empty the dropdown content GO")

        $('.results-dropdown-container').empty();
        console.log("Empty the dropdown content GO")
    
        // Call the function to initialize the dropdown content for regular genres
        initializeDropdowns(player, genre, input_value);
    
        // Call the function to initialize the dropdown content for wildcard genre
        // initializeWildcard(player);
    
        console.log("Player in focus input change");
        console.log(player);
    });
    
    
    

    // // Event handler to hide dropdown when cursor moves off
    // $(document).on('mouseleave', '.dropdown-menu', function () {
    //     $(this).slideUp();
    // });

    $(".start-button").click(function () {
        // Disable the start button after it's clicked
        $(this).prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: '/start_game',
            success: function (response) {
                startButtonClicked = true;
                current_player = response.current_player;
                console.log("selectedMovies in start_game before variable", selectedMovies)
                // selectedMovies[current_player] = {};
                console.log("selectedMovies in start_game before variable", selectedMovies)
    
                $('.begin-game-body').hide(); 
                
                // initializeDropdowns(current_player, wildcard, input_value) 

                var modal = document.getElementById("myModal");
    
                // Open the modal
                modal.style.display = "block";
            
                // Get the <span> element that closes the modal
                var closeBtn = modal.querySelector(".close");
            
                // When the user clicks on <span> (x), close the modal
                closeBtn.onclick = function() {
                    modal.style.display = "none";
                }
            
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
    
                updateStartInputState();
    
                // handleEndOfGame();
    
                $(document).one('click', '.confirm-button', function() {
    
                    // confirmedSelection = true;
                    updateInputState();
    
                });
            }
        });
    });
    
    
    // Event handler for the "Confirm" button
    $(document).on('click', '.confirm-button', async function () {
        if (!startButtonClicked) {

            return;
        }

        $('.table-containers').addClass('hidden-table');
        clickedConfirmButtons++; // Increment the count of clicked confirm buttons
        var playerIndex = $(this).data('index');
        var playerName = $(this).data('player');
        var genre = $(this).data('genre');
        var selectedMovie = $('.movie-input[data-index="' + playerIndex + '"][data-genre="' + genre + '"]').val();

        console.log("selected Movie in congfirm button", selectedMovie)

        console.log("selected MovieS after confirm button selectedMovie", selectedMovies)

        console.log("clicked confirm buttons", clickedConfirmButtons)

        console.log("totalConfirmButtons", totalConfirmButtons)

        if (clickedConfirmButtons === totalConfirmButtons) {
            // If all confirm buttons have been clicked, show a popu
            // Reset the count of clicked confirm buttons for future use
            console.log("we got to handle end of game within (clickedConfirmButtons === totalConfirmButtons")
            handleEndOfGame();
        }

        if (!selectedMovie) {
            alert('Please select a movie before confirming.');
            return;
        }

        var combinedVariable = playerIndex + '_' + genre;
        disabledCombinedVariables.push(combinedVariable);

        await updateInputState(playerIndex);

        // Update selectedMovies object with the selected movie
        selectedMovies.push(selectedMovie)
        console.log("Collecting selected movies info", selectedMovies)

        if (!selectedMoviesForPlayers[playerIndex]) {
            selectedMoviesForPlayers[playerIndex] = [];
        }
        
        // Push the selected movie into the array for the current player
        selectedMoviesForPlayers[playerIndex].push({
            playerIndex: playerIndex,
            playerName: playerName,  
            genre: genre,
            movie: selectedMovie
        });

        console.log('selectedMovies_for_players', selectedMoviesForPlayers)
        console.log("selectedMovies:", selectedMovies);
    });

    // AJAX request to fetch player names from the server
    $.ajax({
        type: 'GET',
        url: '/get_player_names',
        success: function (response) {
            playerNames = response.player_names;
            console.log("get players is called")
            $(document).on('click', '.results-dropdown p', function() {
                if (!$(this).hasClass('disabled')) {
                    var selectedValue = $(this).text();
                    console.log("selcted Value in results-dropdown p", selectedValue)
                    var playerIndex = $(this).closest('.results-dropdown').data('index');
                    var genre = $(this).closest('.results-dropdown').data('genre');

                    // Set the value of the corresponding input field
                    $('.movie-input[data-index="' + playerIndex + '"][data-genre="' + genre + '"]').val(selectedValue);
                    console.log("this is how we set the input field")

                    // Delay hiding the dropdown to ensure input value retention
                    setTimeout(() => {
                        $(this).addClass('disabled disabled-movie');
                        $(this).closest('.results-dropdown').empty().hide();
                    }, 100); // Adjust the delay time as needed
                }
            });
        }
    })
});