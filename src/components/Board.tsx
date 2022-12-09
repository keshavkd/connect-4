import React, { useState, useEffect, useContext } from "react";
import "../styles/styles.css";
import Button from "@mui/material/Button";
import Scoreboard from "./Scoreboard";
import { boxStyles, solveBoard } from "../util/boardHelper";
import { GameContext } from "../util/GameContext";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

/*
 * Function to get a random integer number in the range [min, max]
 * @param min: number
 * @param max: number
 * @return :number
 */
const getRandom = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/*
 * Default Board export function which hosts the main rendering components for the board
 * @return :JSX
 */
function Board() {
  const {
    playerOneName,
    playerOneAge,
    playerTwoName,
    playerTwoAge,
    seconds,
    setSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
    getTime,
    gameId,
    setGameId,
  } = useContext(GameContext);

  // Setting board paramaters
  const numberOfRows = 6;
  const numberOfColumns = 7;
  const winningCount = 4;

  // Main board
  const [board, setBoard] = useState<number[][]>(
    Array(numberOfRows)
      .fill(0)
      .map((row) => new Array(numberOfColumns).fill(0))
  );
  const [playerTurn, setPlayerTurn] = useState<number>(getRandom(0, 1));
  const [numberOfTurns, setNumberOfTurns] = useState<number>(0);
  const [endState, setEndState] = useState<boolean>(false);
  const [winner, setWinner] = useState<boolean>();
  const [pause, setPause] = useState<boolean>(false);
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  /*
   * Function that resets the board and other states to the default state to start a new game
   * @return :void
   */
  const retryState = () => {
    setBoard(
      Array(numberOfRows)
        .fill(0)
        .map((row) => new Array(numberOfColumns).fill(0))
    );
    setPlayerTurn(playerTurn === 0 ? 1 : 0);
    setNumberOfTurns(0);
    setEndState(false);
    setWinner(undefined);
    resetTimer();
    startTimer();
    setGameId((g: number) => g + 1);
    setOpen(false);
  };

  /*
   * Function to close modal and show scoreboard
   * @return :void
   */
  const closeModal = () => {
    setShowScoreboard(true);
    setOpen(false);
  };

  /*
   * Function to handle player moves and calls helper methods that have core logic of the game
   * Calls solveBoard util helper function
   * @param columnIndex: number, Index of the column where the individual tile is located on click
   * @return void
   */
  const handleClick = (columnIndex: number) => {
    if (endState) return;
    let { win, end, turns, boardx } = solveBoard(
      board,
      columnIndex,
      numberOfTurns,
      playerTurn,
      winningCount
    );

    // If winner is found, sets winner and pauses state for scoreboard updates
    if (win) {
      setWinner(playerTurn === 0 ? false : true);
      setPause(true);
    }
    // Pauses timer if end state (win/tie)
    // If not end state, sets player turn to the other player
    if (end) {
      pauseTimer();
    } else {
      setPlayerTurn(playerTurn === 0 ? 1 : 0);
    }
    setEndState(end);
    setNumberOfTurns(turns);
    setBoard(boardx);
  };

  /*
   * ComponentOnUpdate method which stores the board state and other states to localStorage for future retrieval
   * when a minimum of 1 second has passed.
   */
  useEffect(() => {
    let data = {
      gameId: gameId,
      board: board,
      playerTurn: playerTurn,
      numberOfTurns: numberOfTurns,
      endState: endState,
      winner: winner,
      seconds: seconds,
    };
    if (seconds > 0) localStorage.setItem("board", JSON.stringify(data));
  }, [gameId, board, playerTurn, numberOfTurns, endState, winner, seconds]);

  /*
   * ComponentOnMount method to retrieve board and other state data on page reload
   */
  useEffect(() => {
    let boardStateObject = localStorage.getItem("board");
    if (boardStateObject !== null) {
      let boardObject = JSON.parse(boardStateObject);
      setGameId(boardObject.gameId);
      setBoard(boardObject.board);
      setNumberOfTurns(boardObject.numberOfTurns);
      setPlayerTurn(boardObject.playerTurn);
      setSeconds(boardObject.seconds);
      setEndState(boardObject.endState);
      setWinner(boardObject.winner);

      // If end state, then pauses timer | if not resumes timer
      if (boardObject.endState === true) {
        pauseTimer();
      } else {
        startTimer();
      }
    } else {
      // If no board exists previously in local storage, starts timer (first board)
      if (endState === false) {
        startTimer();
      }
    }
  }, []);

  /*
   * ComponentOnUpdate method when game ends with result, time and other states
   */
  useEffect(() => {
    let scoreboardResults = localStorage.getItem("scoreboard");
    let results = [];

    let currentResult = {
      gameId: gameId,
      playerOneName: playerOneName,
      playerOneAge: playerOneAge,
      playerTwoName: playerTwoName,
      playerTwoAge: playerTwoAge,
      numberOfTurns: numberOfTurns,
      winner: winner,
      seconds: seconds % 60,
      minutes: Math.floor(seconds / 60),
    };

    if (pause && endState) {
      if (scoreboardResults) {
        results = JSON.parse(scoreboardResults);
        // Checks last game in local storage with current game in order to avoid
        // pushing duplicate boards as it satisfies pause && endState on page reload
        if (results[results.length - 1].gameId !== gameId)
          results.push(currentResult);
      } else {
        results.push(currentResult);
      }
      localStorage.setItem("scoreboard", JSON.stringify(results));
    }
  }, [
    gameId,
    pause,
    playerOneName,
    playerOneAge,
    playerTwoName,
    playerTwoAge,
    endState,
    numberOfTurns,
    winner,
    seconds,
  ]);

  /*
   * ComponentOnUpdate method to display popup of result when end state is true
   */
  useEffect(() => {
    if (endState === true) {
      setOpen(true);
    }
  }, [endState]);

  /*
   * ComponentOnUpdate method to switch between board and scoreboard with timer logic
   * Pauses timer when board is switched to scoreboard
   * Resumes timer when scoreboard is switched to board only if end state is not true
   */
  useEffect(() => {
    if (showScoreboard) {
      pauseTimer();
    } else {
      let b = localStorage.getItem("board");
      if (b !== null && !JSON.parse(b).endState) {
        startTimer();
      }
    }
  }, [showScoreboard, endState, pauseTimer, startTimer]);

  return (
    <div className="container">
      {!showScoreboard ? (
        <>
          {winner === undefined ? (
            endState === true ? (
              <div className="turn" id="turn-pill-tie">
                <h1>It's a tie!</h1>
              </div>
            ) : (
              <div
                className="turn"
                id={`turn-pill-${playerTurn === 0 ? "one" : "two"}`}
              >
                <h1>
                  {playerTurn === 0 ? playerOneName : playerTwoName}'s turn to
                  play
                </h1>
              </div>
            )
          ) : (
            <div className="turn" id="turn-pill-victory">
              <h1>{`${
                winner ? playerTwoName : playerOneName
              } is the winner!`}</h1>
            </div>
          )}

          <div id="score-alert">
            {open ? (
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={boxStyles}>
                  <div className="row">
                    {winner === undefined ? (
                      <h1>It's a tie!</h1>
                    ) : (
                      <h1>
                        {winner ? playerTwoName : playerOneName} is the winner!
                      </h1>
                    )}
                  </div>
                  <div className="row">
                    <h2>Score: {numberOfTurns}</h2>
                  </div>
                  <div className="row">
                    <Button variant="outlined" onClick={() => retryState()}>
                      Start new game
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => closeModal()}
                    >
                      Show scoreboard
                    </Button>
                  </div>
                </Box>
              </Modal>
            ) : (
              <></>
            )}
          </div>
          <h2>
            <span className="icon material-symbols-outlined">timer</span>
            {getTime()}
          </h2>
          <div id="board" style={{ width: numberOfColumns * 100 }}>
            {board.map((row, index) => {
              return (
                <div key={`row-${index}`} className={`grid grid-row-${index}`}>
                  {row.map((column, columnIndex) => {
                    return (
                      <div
                        key={`column-${column}-${columnIndex}`}
                        className={`tile tile-${
                          column === -1 ? 2 : column
                        } row-${index} column-${columnIndex}`}
                        onClick={() => handleClick(columnIndex)}
                      ></div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div id="button-group">
            <Button variant="contained" onClick={() => retryState()}>
              Start new game
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setShowScoreboard(true)}
            >
              Show scoreboard
            </Button>
          </div>
        </>
      ) : (
        <Scoreboard setShowScoreboard={setShowScoreboard} />
      )}
    </div>
  );
}

export default Board;
