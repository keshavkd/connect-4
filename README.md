# Connect 4 React Application - ZoomInfo Assignment

The rules of the game are:

- Players must connect 4 of the same colored discs in a row to win. This can be done horizontally, vertically or diagonally.
- Only one piece is played at a time.
- Players can be on the offensive or defensive.
- The game ends when there is a 4-in-a-row or a stalemate when all forty two slots are filled.
- The starter of the previous game goes second in the next game.
- The board has 42 windows distributed in 6 rows and 7 columns.

## Requirements

- ‘create user form’ with the fields: Nickname, age. The form will appear in the beginning before the game is played and in case we already have users we will not see the form again (users were already created and saved).
- The game will start with a random player.
- In the end of the game we will see a popup with the winners name and and two buttons: ‘Start a new game’ and ‘Go to the score board’ where we will be able to see the scores of the games. The score is a counter of how many moves did it take to finish the game.
- On the scoreboard we will see the list of playing games with the fields: Winner, counter of moves and duration of the game in minutes and seconds.

## Features

- Save game state to local storage to populate board state on page reload
- Save list of scores in the scoreboard (persist data on page reload)
- Clear state to restart process
- New game to create new game session

## Installation

- [Install Node.js](https://nodejs.dev/en/download/)
-

```
npm install && npm start
```

## Web server

- [Link to game](https://63941f32d3b1f2585421bb3f--super-yeot-228c22.netlify.app/)
