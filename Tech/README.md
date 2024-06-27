# The Reel Draft**

**A web application that allows users to draft films by year and play against their friends. Built using Python, with data scraped from www.themoviedb.com.**

Note: This app was focused exclusively on movies between 1970 and 2023. It will now include future years as well as television shows. 

**Screenshot of the app:
**

### SITE USAGE

After clicking play, a user will select the following:

- Year to Draft
- Number of Player
- Name of Players 

The order of players will be chosen at random, and each will be assigned a color. 

**Each player will have a gameboard with the following categories:**

- Drama
- Comedy/Animation
- Sci-Fi/Fantasy 
- Action/Thriller/Horror
- Blockbuster (The top highest-grossing films of that year.)
- Wildcard

For each chart, the user can hover over a bar on the category name to a list of films that would be eligible in that category. 

### GAMEPLAY

1. A movie can only be chosen once in the ENTIRE game. 
       
   **For example:** If you are drafting the year 2001, the film The Lord of the Rings: The Fellowship of the Ring could be eligible in Drama, Sci-Fi/Fantasy, Blockbuster, Action/Thriller/Horror, and Wildcard. However, if Player 2 selects it in Blockbuster, it cannot be selected again. **Once a movie is selected it is off the board.** 

2. The gameplay is in a snake fashion. 

      **For example:** If there are four players, the order of players would be as follows:
      - **(Round 1)** Player 1, Player 2, Player 3, Player 4
      - **(Round 2)** Player 4, Player 3, Player 1, Player 1
      - **(Round 3)** Player 1, Player 2, Player 3, Player 4
      - **(Round 4)** Player 4, Player 3, Player 1, Player 1
      - **(Round 5)** Player 1, Player 2, Player 3, Player 4
      - **(Round 6)** Player 4, Player 3, Player 1, Player 1

     This means that at the end of each round (until the last one), the player who just selected a movie gets to choose again. 

3. The scoring is based on several factors determined by the API:
      - **Popularity**  (From TMDB): 
        - Number of votes for the day
        - Number of views for the day
        - Number of users who marked it as a "favorite" for the day
        - Number of users who added it to their "watchlist" for the day
        - Release date
        - Number of total votes
        - Previous day's score
      - **Vote Count** The number of votes the film has received all time. 
      - **Vote Average** The average score (between 1 and 10) that the film has received. 
      - **Relative Revenue** TMDB does not provide the actual amount a movie made; however, it does list films in order of revenue. The ranking of the film in this list is what is considered in the revenue category. 

        These scores are combined for an average score that is returned to the user. 
 
**Technology Used:**
Python
Flask
JavaScript
