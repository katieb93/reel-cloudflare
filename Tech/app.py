import requests, random
import time
import click
from flask import Flask, render_template, request, session, json, jsonify
from markupsafe import Markup  # Import Markup from markupsafe module


import sqlite3
import uuid



def search_genres(search_str, genre=None):
    year = session.get('year')
    movie_data_fetcher = MovieDataFetcher()

    # Mapping of genres to corresponding genres for data fetching
    genre_mapping = {
        'drama': ['drama'],
        'comedyAnimation': ['comedy', 'animation'],
        'sciFiFantasy': ['science fiction', 'fantasy'],
        'actionThrillerHorror': ['action', 'thriller', 'horror'],
    }

    search_results = []

    if genre in genre_mapping:
        genre_movies = movie_data_fetcher.get_movies_by_year_genres_votes(year, genre_mapping[genre])
        print("GENRE MOVIES", genre_movies)

        for movie_item in genre_movies:
            if movie_item['title'] and search_str.lower() in movie_item['title'].lower():
                search_results.append(movie_item['title'])

    elif genre == 'Blockbuster':
        blockbuster_movies = movie_data_fetcher.get_movies_blockbuster(year)
        for movie_item in blockbuster_movies:
            if movie_item['title'] and search_str.lower() in movie_item['title'].lower():
                search_results.append(movie_item['title'])

    elif genre == 'Wildcard':
        wildcard_movies = movie_data_fetcher.get_movies_by_year(year)
        for movie_item in wildcard_movies:
            if movie_item['title'] and search_str.lower() in movie_item['title'].lower():
                search_results.append(movie_item['title'])
    
    return list(search_results)

# Modified search_genres_wildcard_source function
def search_genres_wildcard_source():
    print("search_genres_wildcard is called")
    year = session.get('year')
    print("search_genres_wildcard is called year", year)
    movie_data_fetcher = MovieDataFetcher()
    print("search_genres_wildcard is called movie_data_fetcher", movie_data_fetcher)

    search_results = []

    wildcard_movies = movie_data_fetcher.get_movies_by_year(year)
    print("search_genres_wildcard is called wildcard_movies", wildcard_movies)
    for movie_item in wildcard_movies:
        if movie_item['title']:
            search_results.append(movie_item['title'])
    
    print("search_genres_wildcard is called wildcard_movies search_results", search_results)
    # Return only the first 20 movies (optional)
    return jsonify(results_html="<p>" + "</p><p>".join(search_results[:20]) + "</p>")


def get_score(selected_movies_game):

    # Assuming 'session' is defined elsewhere
    year = session.get('year')
    movie_data_fetcher = MovieDataFetcher()

    # selected_movies_game = [
    #     [
    #         {'playerIndex': 0, 'playerName': 'nat', 'genre': 'drama', 'movie': 'Dead Poets Society'},
    #         {'playerIndex': 0, 'playerName': 'nat', 'genre': 'comedyAnimation', 'movie': 'Back to the Future Part II'},
    #         {'playerIndex': 0, 'playerName': 'nat', 'genre': 'sciFiFantasy', 'movie': 'The Abyss'},
    #         {'playerIndex': 0, 'playerName': 'nat', 'genre': 'actionThrillerHorror', 'movie': 'Batman'},
    #         {'playerIndex': 0, 'playerName': 'nat', 'genre': 'Blockbuster', 'movie': "Look Who's Talking"},
    #         {'playerIndex': 0, 'playerName': 'nat', 'genre': 'Wildcard', 'movie': "Ghostbusters II"}
    #     ],
    #     [
    #         {'playerIndex': 1, 'playerName': 'tai', 'genre': 'drama', 'movie': 'Born on the Fourth of July'},
    #         {'playerIndex': 1, 'playerName': 'tai', 'genre': 'comedyAnimation', 'movie': 'Turner & Hooch'},
    #         {'playerIndex': 1, 'playerName': 'tai', 'genre': 'sciFiFantasy', 'movie': 'The Blood of Heroes'},
    #         {'playerIndex': 1, 'playerName': 'tai', 'genre': 'actionThrillerHorror', 'movie': 'Road House'},
    #         {'playerIndex': 1, 'playerName': 'tai', 'genre': 'Blockbuster', 'movie': 'The War of the Roses'},
    #         {'playerIndex': 1, 'playerName': 'tai', 'genre': 'Wildcard', 'movie': 'Parenthood'}
    #     ]
    # ]

    genre_mapping = {
        'drama': ['drama'],
        'comedyAnimation': ['comedy', 'animation'],
        'sciFiFantasy': ['science fiction', 'fantasy'],
        'actionThrillerHorror': ['action', 'thriller', 'horror'],
    }

    genre_all_mapping = {
        'drama': movie_data_fetcher.get_movies_by_year_genres(year, genre_mapping['drama']),
        'comedyAnimation': movie_data_fetcher.get_movies_by_year_genres(year, genre_mapping['comedyAnimation']),
        'sciFiFantasy': movie_data_fetcher.get_movies_by_year_genres(year, genre_mapping['sciFiFantasy']),
        'actionThrillerHorror': movie_data_fetcher.get_movies_by_year_genres(year, genre_mapping['actionThrillerHorror']),
        'Blockbuster': movie_data_fetcher.get_movies_blockbuster(year),
        'Wildcard': movie_data_fetcher.get_movies_by_year(year)
    }


    def get_genre_sorted_popularity(genre):
        if genre in genre_all_mapping:
            genre_movies_by_year = genre_all_mapping[genre]
            return [
                (index, movie['title'])  # Extracting only index and title
                for index, movie in enumerate(sorted(genre_movies_by_year, key=lambda x: x['popularity']))
            ]
        else:
            print(f"Genre '{genre}' not supported.")
            return []

    def get_genre_sorted_vote_count(genre_movies_by_year):
        # Extract count sorted list
        genre_sorted_vote_count = [
            (index, movie['title'])  # Extracting only index and title
            for index, movie in enumerate(sorted(genre_movies_by_year, key=lambda x: x['vote_count']))
        ]
        return genre_sorted_vote_count

    def get_genre_sorted_value_popularity(genre):
        if genre in genre_all_mapping:
            genre_sorted_popularity = get_genre_sorted_popularity(genre)
            genre_sorted_value_popularity = [{'value': (index + 1) * 5 if genre == "Blockbuster" else (index + 1), 'title': title} for index, title in genre_sorted_popularity]
            return genre_sorted_value_popularity[::-1]
        else:
            print(f"Genre '{genre}' not supported.")
            return []

    def get_genre_sorted_value_count(genre):
        if genre in genre_all_mapping:
            genre_movies_by_year = genre_all_mapping[genre]
            genre_sorted_vote_count = get_genre_sorted_vote_count(genre_movies_by_year)
            genre_sorted_value_count = [{'value': (index + 1) * 5 if genre == "Blockbuster" else (index + 1), 'title': title} for index, title in genre_sorted_vote_count]
            genre_sorted_value_count.reverse()
            return genre_sorted_value_count
        else:
            print(f"Genre '{genre}' not supported.")
            return []

    def get_genre_sorted_by_average(genre):
        if genre in genre_all_mapping:
            genre_movies_by_year = genre_all_mapping[genre]
            genre_sorted_value_average = [{'value': movie['vote_average'] * 10, 'title': movie['title']} for movie in genre_movies_by_year]
            genre_sorted_by_average = sorted(genre_sorted_value_average, key=lambda movie: movie['value'], reverse=True)
            return genre_sorted_by_average
        else:
            print(f"Genre '{genre}' not supported.")
            return []

    def get_genre_sorted_value_revenue(genre):
        if genre in genre_all_mapping:
            genre_movies_by_year = genre_all_mapping[genre]
            genre_sorted_value_revenue = []
            num_movies = len(genre_movies_by_year)
            for index, movie in enumerate(genre_movies_by_year):
                value = num_movies - index
                if genre == 'Blockbuster':
                    value *= 5
                genre_sorted_value_revenue.append({'value': value, 'title': movie['title']})
            return genre_sorted_value_revenue[::-1]  # Reverse the list
        else:
            print(f"Genre '{genre}' not supported.")
            return []

    def get_genre_sorted_lists(genre):

        popularity = get_genre_sorted_value_popularity(genre)
        count = get_genre_sorted_value_count(genre)
        average = get_genre_sorted_by_average(genre)
        revenue = get_genre_sorted_value_revenue(genre)

        genre_info = {
            'popularity': [{'value': item['value'], 'title': item['title']} for item in popularity],
            'count': [{'value': item['value'], 'title': item['title']} for item in count],
            'average': [{'value': item['value'], 'title': item['title']} for item in average],
            'revenue': [{'value': item['value'], 'title': item['title']} for item in revenue]
        }

        return genre_info


    def get_movie_detail(sorted_movies, movie_title, detail_key):
        for movie in sorted_movies:
            if movie['title'] == movie_title:
                return movie.get(detail_key, None)
        return None


    # def match_movies_by_genre(selected_movies_game, genre):
    #     genre_sorted_info = get_genre_sorted_lists(genre)
    #     genre_movies = {}

    #     for player_movies in selected_movies_game:
    #         player_name = player_movies[0]['playerName']
    #         genre_movies[player_name] = {}  # Initialize empty dict for player

    #         for movie in player_movies:  # Iterate through all movies in player's list
    #             if movie['genre'] == genre:
    #                 movie_info = {
    #                     'genre': movie['genre'],
    #                     'popularity': get_movie_detail(genre_sorted_info['popularity'], movie['movie'], 'value'),
    #                     'count': get_movie_detail(genre_sorted_info['count'], movie['movie'], 'value'),
    #                     'average': get_movie_detail(genre_sorted_info['average'], movie['movie'], 'value'),
    #                     'revenue': get_movie_detail(genre_sorted_info['revenue'], movie['movie'], 'value')
    #                 }
    #                 genre_movies[player_name] = movie_info  # Update with movie info if genre matches

    #     return genre_movies

    def match_movies_by_genre(selected_movies_game, genre):

        genre_sorted_info = get_genre_sorted_lists(genre)
        genre_movies = {}

        for player_movies in selected_movies_game:
            player_name = player_movies[0]['playerName']
            genre_movies[player_name] = []  # Initialize an empty list for player

            for movie in player_movies:  # Iterate through all movies in player's list
                if movie['genre'] == genre:
                    movie_info = {
                        'genre': movie['genre'],
                        'popularity': get_movie_detail(genre_sorted_info['popularity'], movie['movie'], 'value'),
                        'count': get_movie_detail(genre_sorted_info['count'], movie['movie'], 'value'),
                        'average': get_movie_detail(genre_sorted_info['average'], movie['movie'], 'value'),
                        'revenue': get_movie_detail(genre_sorted_info['revenue'], movie['movie'], 'value')
                    }
                    genre_movies[player_name].append(movie_info)  # Append movie info to the list

        return genre_movies

    drama_matched = match_movies_by_genre(selected_movies_game, 'drama')
    comedyAnimation_matched = match_movies_by_genre(selected_movies_game, 'comedyAnimation')
    sciFiFantasy_matched = match_movies_by_genre(selected_movies_game, 'sciFiFantasy')
    actionThrillerHorror_matched = match_movies_by_genre(selected_movies_game, 'actionThrillerHorror')
    Blockbuster_matched = match_movies_by_genre(selected_movies_game, 'Blockbuster')
    Wildcard_matched = match_movies_by_genre(selected_movies_game, 'Wildcard')

    def calculate_average(genre):
        averages = {}

        for player, player_data in genre.items():
 
            if player_data:  # Check if player_data is not empty
                player_info = player_data[0]  # Assuming there's only one dictionary in the list
                # Extract numerical values
                popularity = player_info.get('popularity', 0)  # Using .get() to provide a default value if key not found
                count = player_info.get('count', 0)
                average = player_info.get('average', 0)
                revenue = player_info.get('revenue', 0)
            else:
                popularity, count, average, revenue = 0, 0, 0, 0  # Set default values if player_data is empty or None
            # Calculate average
            average_of_four = (popularity + count + average + revenue) / 4

            averages[player] = average_of_four

        return averages
    
    # average_drama = calculate_average(drama_matched)
    # average_comedyAnimation = calculate_average(comedyAnimation_matched)
    # average_sciFiFantasy = calculate_average(sciFiFantasy_matched)
    # average_actionThrillerHorror = calculate_average(actionThrillerHorror_matched)
    # average_Blockbuster = calculate_average(Blockbuster_matched)
    # average_Wildcard = calculate_average(Wildcard_matched)


    # def calculate_player_averages(average_drama, average_comedyAnimation, average_sciFiFantasy, average_actionThrillerHorror, average_Blockbuster, average_Wildcard):
    def calculate_player_averages():

        player_averages = {}

        # Iterate through each player in drama_matched (assuming similar structure for other dictionaries)
        for player_name, genre_info in drama_matched.items():
            # Initialize player's average to 0
            player_average = 0
            num_genres_with_data = 0  # Count genres with entries for this player

            for genre_data in genre_info:
                if genre_data:

                    player_average += genre_data['average']  # Add drama average if it exists
                    num_genres_with_data += 1

            # Repeat checks for other genres (comedyAnimation_matched, etc.) using similar logic

            # Calculate final average (handle cases with no entries)
            if num_genres_with_data > 0:
                player_average /= num_genres_with_data

            player_averages[player_name] = player_average

        return player_averages

    average_overall_final = calculate_player_averages()    
    
    # Return all necessary results
    return {
        # "indices_by_category": indices_by_category,
        "average_overall_final_player": average_overall_final
    }


def search_movies(search_str, movies):
    # Use a set to store unique movie titles
    unique_movies = set()

    # Case-insensitive comparison
    search_str_lower = search_str.lower()

    for movie in movies:
        movie_title_lower = movie.lower()
        if search_str_lower in movie_title_lower and movie_title_lower not in unique_movies:
            unique_movies.add(movie_title_lower)

    return list(unique_movies)

def create_players_data(player_names):
    players_data = []
    genres = ["drama", "comedyAnimation", "sciFiFantasy", "actionThrillerHorror", "Blockbuster", "Wildcard"]

    for player_number, player_name in enumerate(player_names, start=1):
        player_data = {
            'index': player_number - 1,
            'name': player_name,
            'genres': genres
        }
        players_data.append(player_data)

    return players_data


def add_selected_movie(current_player, selected_movie_title):
    if selected_movie_title and selected_movie_title not in session['selected_movies'][current_player]:
        # Add the selected movie to the current player's list
        session['selected_movies'][current_player].append(selected_movie_title)



class directions:

    def forward_round(current_player):

        current_player += 1
        current_button_number = current_player
        next_button_number = current_button_number + 1
        return current_button_number, current_player, next_button_number

    def reverse_round(current_player, current_button_number):

        current_player -= 1
        current_button_number = current_player
        next_button_number = current_button_number - 1
        session['next_button_number'] = next_button_number
        return current_button_number, current_player, next_button_number

    def reverse_mode(current_player, current_button_number):

        last_button_click_count = 0
        session['last_button_click_count'] = last_button_click_count
        round_order = directions.reverse_round(current_player, current_button_number)
        current_button_number, current_player, next_button_number = round_order
        current_player = current_player 
        reverseActivated = True
        session['reverseActivated'] = reverseActivated

        return current_button_number, current_player, next_button_number
    
class MovieDataFetcher:
    def __init__(self):
        self.api_endpoint_url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&"
        self.api_headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGU4NGZlZGFjOTkzZmViZDIzNjkxY2VjNzNjYzkzNyIsInN1YiI6IjY1NjRmYjY5N2RmZGE2NTkzMjY2NjJmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d5YBx0beKUDZHUkKdt5s3VK3j1VmKCgaP1NUtMCV0r8"
        }

    def get_movies_by_year(self, year):
        all_movies = []
        current_year_url = f"{self.api_endpoint_url}&primary_release_year={year}&sort_by=revenue.desc"
        for page in range(1, 6):
            current_url = f"{current_year_url}&page={page}"
            response = requests.get(current_url, headers=self.api_headers)
            if response.status_code == 200:
                movie_data = response.json()
                for movie in movie_data['results']:
                    movie_info = {
                        'title': movie['title'],
                        'popularity': movie['popularity'],
                        'vote_count': movie['vote_count'],
                        'vote_average': movie['vote_average'],
                    }
                    all_movies.append(movie_info)
            else:
                print("Error fetching data from page", page)

        return all_movies
    
    def get_genre_id(self, genre_name):

        genre_mapping = {
            'drama': 18,  
            'comedy': 35,
            'animation': 16, 
            'action': 28,
            'horror': 27,
            'thriller': 53, 
            'science fiction': 878,
            'fantasy': 14,
            # Add more genres as needed
        }

        return genre_mapping.get(genre_name.lower())
    
    def get_movies_by_year_votes(self, year):
        all_movies = []
        current_year_url = f"{self.api_endpoint_url}&primary_release_year={year}&region=United%20States&sort_by=vote_count.desc&page={page}"
        for page in range(1, 6):
            current_url = f"{current_year_url}&page={page}"
            response = requests.get(current_url, headers=self.api_headers)
            if response.status_code == 200:
                movie_data = response.json()
                for movie in movie_data['results']:
                    movie_info = {
                        'title': movie['title'],
                        'popularity': movie['popularity'],
                        'vote_count': movie['vote_count'],
                        'vote_average': movie['vote_average'],
                    }
                    all_movies.append(movie_info)
            else:
                print("Error fetching data from page", page)

        return all_movies



    
    def get_genre_id(self, genre_name):

        genre_mapping = {
            'drama': 18,  
            'comedy': 35,
            'animation': 16, 
            'action': 28,
            'horror': 27,
            'thriller': 53, 
            'science fiction': 878,
            'fantasy': 14,
            # Add more genres as needed
        }

        return genre_mapping.get(genre_name.lower())

    def get_movies_by_year_genres(self, year, genres):
        genre_ids = [self.get_genre_id(genre) for genre in genres]
        print("slack 1")
        print(genre_ids)
        genre_ids = [genre_id for genre_id in genre_ids if genre_id is not None]
        print("slack 2")
        print(genre_ids)

        if not genre_ids:
            print(f"No valid genre IDs found for {genres}")
            return []

        all_movies = []
        added_movies = set()  # Keep track of added movie titles

        for genre_id in genre_ids:
            for page in range(1, 6):
                current_url = f"{self.api_endpoint_url}&primary_release_year={year}&with_genres={genre_id}&region=United%20States&sort_by=revenue.desc&page={page}"
                print("slack 3")
                print(current_url)
                response = requests.get(current_url, headers=self.api_headers)
                print("slack 4")
                print(response)
                if response.status_code == 200:
                    movie_data = response.json()
                    for movie in movie_data['results']:
                        title = movie['title']
                        if title not in added_movies:  # Check if the movie is not already added
                            movie_info = {
                                'title': title,
                                'popularity': movie['popularity'],
                                'vote_count': movie['vote_count'],
                                'vote_average': movie['vote_average'],
                            }
                            all_movies.append(movie_info)
                            added_movies.add(title)  # Add the title to the set of added movies
                else:
                    print("Error fetching data from page", page)

        # Limit to 100 movies
        all_movies = all_movies[:100]

        return all_movies

    def get_movies_by_year_genres_votes(self, year, genres):
        genre_ids = [self.get_genre_id(genre) for genre in genres]
        print("slack 1")
        print(genre_ids)
        genre_ids = [genre_id for genre_id in genre_ids if genre_id is not None]
        print("slack 2")
        print(genre_ids)

        if not genre_ids:
            print(f"No valid genre IDs found for {genres}")
            return []

        all_movies = []
        visited_movies = set()  # Keep track of visited movies

        for genre_id in genre_ids:
            for page in range(1, 6):
                current_url = f"{self.api_endpoint_url}&primary_release_year={year}&with_genres={genre_id}&region=United%20States&sort_by=vote_count.desc&page={page}"
                print("slack 3")
                print(current_url)
                response = requests.get(current_url, headers=self.api_headers)
                print("slack 4")
                print(response)
                if response.status_code == 200:
                    movie_data = response.json()
                    for movie in movie_data['results']:
                        title = movie['title']
                        # Check if the movie has already been added
                        if title not in visited_movies:
                            movie_info = {
                                'title': title,
                                'popularity': movie['popularity'],
                                'vote_count': movie['vote_count'],
                                'vote_average': movie['vote_average'],
                            }
                            all_movies.append(movie_info)
                            visited_movies.add(title)  # Mark the movie as visited
                else:
                    print("Error fetching data from page", page)

        all_movies.sort(key=lambda x: x['vote_count'], reverse=True)

        # Limit to 100 movies
        all_movies = all_movies[:100]

        return all_movies

    def get_movies_blockbuster(self, year):
        all_movies = []
        current_year_url = f"{self.api_endpoint_url}&primary_release_year={year}&sort_by=revenue.desc"
        current_url = f"{current_year_url}&page=1"  # Only one page of results
        response = requests.get(current_url, headers=self.api_headers)
        if response.status_code == 200:
            movie_data = response.json()
            for movie in movie_data['results']:
                movie_info = {
                    'title': movie['title'],
                    'popularity': movie['popularity'],
                    'vote_count': movie['vote_count'],
                    'vote_average': movie['vote_average']
                    # Add more information if needed
                }
                all_movies.append(movie_info)
        else:
            print("Error fetching data from page 1")
        return all_movies
    
app = Flask(__name__)
app.secret_key = 'your_secret_key'


@app.route('/')
def begin():
    """Return homepage."""
    return render_template("index.html")

@app.route('/grabInfo')
def grabInfo():
    print("Grab Info!")
    """Return infoGather."""
    return render_template("infoGather.html")

@app.route('/play')
def play():
    # Connect to the SQLite database
    conn = sqlite3.connect("the-reel-draft-database.db")
    cursor = conn.cursor()

    # Generate a new UUID
    games_uuid = str(uuid.uuid4())

    # Convert UUID string to integer (for demonstration)
    games_uuid_int = int(games_uuid.replace("-", ""), 16)

    # Insert the integer UUID into the database
    cursor.execute("INSERT INTO Games (Id) VALUES (?)", (games_uuid_int,))

    # Commit the transaction
    conn.commit()

    # Retrieve the integer UUID from the database
    cursor.execute("SELECT Id FROM Games")
    result = cursor.fetchone()

    if result:
        stored_uuid_int = result[0]

        # Convert integer UUID back to string
        stored_uuid_str = '{:032x}'.format(stored_uuid_int)
        stored_uuid_str_formatted = '-'.join([stored_uuid_str[:8], stored_uuid_str[8:12], stored_uuid_str[12:16], stored_uuid_str[16:20], stored_uuid_str[20:]])

        print("Stored UUID (as integer):", stored_uuid_int)
        print("Stored UUID (as string):", stored_uuid_str_formatted)

    # Close connection
    conn.close()

@app.route('/grabs')
def grabs():
    year = request.args.get("year")
    session['year'] = year

    num_of_players = int(request.args.get("num_players")) # our players
    session['num_of_players'] = num_of_players

    name_inputs = [f" {player_number}: " for player_number in range(1, num_of_players + 1)]
    # name_inputs = [f"{player_number}: " for player_number in range(1, num_of_players + 1)]

    return render_template("grabs.html", name_inputs=name_inputs, num_players=num_of_players, year_chosen=year)

@app.route('/player_boards', methods=['GET', 'POST'])
def game_route():

    # played_players = []
    # year = session.get("year")
    num_of_players = session.get("num_of_players")
    
    # Retrieve player names from the form data
    player_names = [request.form.get(f'player_{i}_name') for i in range(1, num_of_players + 1)]
    session['player_names'] = player_names
    session['num_of_players'] = num_of_players  # Store in session

    # player_names = session.get('player_names')
    print("PLAYER NAMES HERE")
    print(player_names)
  
    random.shuffle(player_names)
    shuffled_numbers = list(range(1, len(player_names) + 1))
    player_order = [{'name': name, 'number': number, 'index': idx} for idx, (name, number) in enumerate(zip(player_names, shuffled_numbers))]
    player_order_dict = {info['name']: info for info in player_order}
    players_data = [] 

    players_data = create_players_data(player_names)

    current_player = 0
    current_button_number = 0
    next_player = 1
    next_button_number = 1
    last_button_click_count = 0
    
    session['player_order_dict'] = player_order_dict
    session['current_player'] = current_player
    session['last_button_click_count'] = 0
    session['reverseActivated'] = False  # Initialize reverseActivated in the session
    session['next_player'] = next_player

    print("WHAT SHOULD BE RETURNED")
    print(player_order_dict)
    print(current_player)
    print(current_button_number)
    print(next_player)
    print(next_button_number)
    print(last_button_click_count)
    print(players_data)

    return render_template('gameboard.html', 
        player_order_dict=session['player_order_dict'], 
        current_player=current_player,
        current_button_number=current_button_number,
        next_player=next_player,
        next_button_number=next_button_number,
        last_button_click_count=last_button_click_count,
        players_data=players_data
    )

@app.route('/player_order', methods=['POST'])
def player_order():

    # played_players = []
    # year = session.get("year")
    num_of_players = session.get("num_of_players")
    
    # Retrieve player names from the form data
    player_names = [request.form.get(f'player_{i}_name') for i in range(1, num_of_players + 1)]
    session['num_of_players'] = num_of_players  # Store in session

    
    session['player_names'] = player_names
    random.shuffle(player_names)
    shuffled_numbers = list(range(1, len(player_names) + 1))
    player_order = [{'name': name, 'number': number, 'index': idx} for idx, (name, number) in enumerate(zip(player_names, shuffled_numbers))]
    player_order_dict = {info['name']: info for info in player_order}
    players_data = [] 

    players_data = create_players_data(player_names)

    current_player = 0
    current_button_number = 0
    next_player = 1
    next_button_number = 1
    last_button_click_count = 0
    
    session['player_order_dict'] = player_order_dict
    session['current_player'] = current_player
    session['last_button_click_count'] = 0
    session['reverseActivated'] = False  # Initialize reverseActivated in the session
    session['next_player'] = next_player


    return render_template("playerOrder.html",         
        player_order_dict=session['player_order_dict'], 
        current_player=current_player,
        current_button_number=current_button_number,
        next_player=next_player,
        next_button_number=next_button_number,
        last_button_click_count=last_button_click_count,
        players_data=players_data
    )

@app.route('/start_game', methods=['POST'])
def start_game():

    session['start_button_clicked'] = True
    session['current_player'] = 0
    session['next_player'] = 0
    session['current_button_number'] = 1
    session['next_button_number'] = 1


    session['last_button_click_count'] = 0

    return {"start_button_clicked": True, "current_player_index": 0, "current_player": 0}

@app.route('/last_button_click', methods=['POST'])
def last_button_click():

    last_button_click_count = session.get('last_button_click_count', 0) + 1
    session['last_button_click_count'] = last_button_click_count
    return jsonify({"last_button_click_count": last_button_click_count})

@app.route('/get_next_player') # AFFECTED
def get_next_player():

    player_names = session.get("player_names", [])
    current_player_index = session.get("current_player_index", 0)

    # Check if the current player index is within the valid range
    if 0 <= current_player_index < len(player_names):
        current_player_name = player_names[current_player_index]
    else:
        return jsonify({'error': 'Invalid current player index'})

    # Calculate the next player's index
    next_player_index = session.get("next_player")
    next_player_name = player_names[next_player_index]

    # Update the current player index in the session
    session['current_player_index'] = next_player_index

    return jsonify({'current_player': current_player_name, 'next_player': next_player_name})


@app.route('/gameplay/<int:currentPlayerIndex>') 
def gameplay(currentPlayerIndex):

    print("bats the musical")

    round_number = 1
    print("dogs the musical")
    print(round_number)

    clicked_index = currentPlayerIndex
    current_player = session.get('current_player', 0)

    selected_movie_title = request.form.get('selected_movie_title')
    add_selected_movie(current_player, selected_movie_title)

    clicked_player = clicked_index
    current_button_number = session.get('current_button_number', 1)

    last_button_click_count = session.get('last_button_click_count', 0)
    start_button_clicked = session.get('start_button_clicked', False)
    round_started = session.get('round_started', False)
    round_order = None
    next_button_number = None
    num_of_players = session.get("num_of_players")

    if 'reverseActivated' not in session:
        session['reverseActivated'] = False

    reverseActivated = session['reverseActivated']

    if not start_button_clicked:
        return "Start button not clicked yet. Please click the start button first."

    if clicked_player == current_player:

        if not round_started:

            round_started = True
            session['round_started'] = round_started

        if clicked_player == num_of_players - 1:

            last_button_click_count += 1
            round_number += 1
            session['last_button_click_count'] = last_button_click_count

            if last_button_click_count == 2:
                current_button_number, current_player, next_button_number = directions.reverse_mode(current_player, current_button_number)
        
        elif reverseActivated:
            if current_player == 0:
                reverseActivated = False
                session['reverseActivated'] = reverseActivated
            else:
                round_order = directions.reverse_round(current_player, current_button_number)
                current_button_number, current_player, next_button_number = round_order
        else:
            round_order = directions.forward_round(current_player)
            current_button_number, current_player, next_button_number = round_order


    session['current_player'] = current_player
    session['current_button_number'] = current_button_number
    session['next_button_number'] = next_button_number
    print("cats the musical")
    print(round_number)

    return {
        "round_order": round_order,
        'num_of_players': num_of_players,
        'current_player': current_player,
        'next_button_number': next_button_number,
        'current_button_number': current_button_number,
        "round_number": round_number
    }

@app.route('/get_player_names')
def get_player_names():
    player_names = session.get("player_names", [])
    session['player_names'] = player_names
    return jsonify({'player_names': player_names})

@app.route('/search_genres', methods=['GET', 'POST'])
def search_genres_route():
    if request.method == 'POST':
        input_value = request.form.get('input_value')
        genre = request.form.get('genre')
        search_results = search_genres(input_value, genre)

        results_html = ""
        for result in search_results:
            results_html += f"<p>{result}</p>"
            
        return jsonify({'results_html': results_html})
    elif request.method == 'GET':
        # Return a JSON response for GET requests
        return jsonify({'message': 'This is a GET request to /search_genres'})
    
@app.route('/search_genres_wildcard', methods=['GET', 'POST'])
def search_genres_route_wildcard():
    if request.method == 'POST':
        genre = request.form.get('genre')
        if genre == 'Wildcard':
            return search_genres_wildcard_source()
        else:
            # Call your search_genres function for other genres
            pass
    elif request.method == 'GET':
        # Return a JSON response for GET requests (optional)
        return jsonify({'message': 'This is a GET request to /search_genres'})
    
@app.route('/get_movie_indices', methods=['GET', 'POST'])
def get_movie_indices():
    if request.method == 'POST':

        data = request.json  # Retrieve data from JSON body
        selected_movies_game = data.get('selected_movies_game')

    elif request.method == 'GET':
        selected_movies_game = request.args.get('selected_movies_game')

    # Call the get_score function to get indices by category and player averages
    result = get_score(selected_movies_game)
    # indices_by_category = result["indices_by_category"]
    average_overall_final_player = result["average_overall_final_player"]

    # Return the result as JSON
    response_data = {
        # "indices_by_category": indices_by_category,
        "average_overall_final_player": average_overall_final_player
    }

    return jsonify(response_data)
    


if __name__ == '__main__':
    app.run(debug=True)
