import TextField from "@mui/material/TextField";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";

import "../styles/styles.css";
import Board from "./Board";

import { GameContext } from "../util/gameContext";

enum PlayerFields {
  NAME,
  AGE,
}

enum ValidationMessages {
  NAME = "Please enter name.",
  AGE = "Please enter valid age.",
}

/*
 * Default UserForm export function which hosts the main rendering components for the initial form
 * details of the two players
 * @return :JSX
 */
function UserForm() {
  const {
    playerOneName,
    playerOneAge,
    playerTwoName,
    playerTwoAge,
    setPlayerOneName,
    setPlayerOneAge,
    setPlayerTwoName,
    setPlayerTwoAge,
    resetTimer,
  } = useContext(GameContext);
  const [validate, setValidate] = useState<boolean[][]>();
  const [hideBoard, setHideBoard] = useState<boolean>(true);

  /*
   * Function to check if given value is true
   * @param value: boolean
   * @return :boolean
   */
  const isTrue = (value: boolean) => value === true;

  /*
   * Function that submits form data on success for future reference
   * Uses form validation to check for empty fields
   * Stores player details in localStorage for future reference / page reload
   * @param event: React.FormEvent<HTMLFormElement>
   */
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let form = event.target as HTMLFormElement;
    let formElements = form.elements;
    let [name1, name2, age1, age2] = [false, false, false, false];
    if (formElements[0].getAttribute("value") !== "") name1 = true;
    if (formElements[1].getAttribute("value") !== "") age1 = true;
    if (formElements[2].getAttribute("value") !== "") name2 = true;
    if (formElements[3].getAttribute("value") !== "") age2 = true;
    setValidate([
      [name1, age1],
      [name2, age2],
    ]);
    if ([name1, name2, age1, age2].every(isTrue)) {
      localStorage.setItem(
        "playersDetails",
        JSON.stringify([
          playerOneName,
          playerOneAge,
          playerTwoName,
          playerTwoAge,
        ])
      );
      setHideBoard(false);
    }
  };

  // Function to clear states, stop timer and clear local storage of game data
  const clearState = () => {
    setPlayerOneName("");
    setPlayerOneAge(undefined);
    setPlayerTwoName("");
    setPlayerTwoAge(undefined);
    setValidate(undefined);
    setHideBoard(true);
    resetTimer();
    localStorage.removeItem("playersDetails");
    localStorage.removeItem("board");
    localStorage.removeItem("scoreboard");
  };

  /*
   * ComponentOnMount method to retrieve player details if already stored in local storage
   * If object is found, shows the board
   */
  useEffect(() => {
    let details = localStorage.getItem("playersDetails");
    if (details) {
      let players = JSON.parse(details);
      setPlayerOneName(players[0]);
      setPlayerOneAge(players[1]);
      setPlayerTwoName(players[2]);
      setPlayerTwoAge(players[3]);
      setHideBoard(false);
    }
  }, []);

  return (
    <div className="container">
      <Button variant="outlined" onClick={() => clearState()}>
        Clear State
      </Button>
      {hideBoard ? (
        <form id="user-form" onSubmit={(event) => submitForm(event)}>
          <h1>Enter player details</h1>
          <div className="row">
            <div className="column">
              <h2 className="user-form-player">Player 1</h2>
              <TextField
                id="player1-name"
                label="Nickname"
                type="text"
                variant="standard"
                value={playerOneName}
                error={validate && !validate[0][PlayerFields.NAME]}
                helperText={
                  validate &&
                  !validate[0][PlayerFields.NAME] &&
                  ValidationMessages.NAME
                }
                onChange={(e) => setPlayerOneName(e.target.value)}
              />
              <TextField
                id="player1-age"
                label="Age"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                variant="standard"
                value={playerOneAge || ""}
                error={validate && !validate[0][PlayerFields.AGE]}
                helperText={
                  validate &&
                  !validate[0][PlayerFields.AGE] &&
                  ValidationMessages.AGE
                }
                onChange={(e) => setPlayerOneAge(parseInt(e.target.value))}
              />
            </div>
            <div className="column">
              <h2 className="user-form-player">Player 2</h2>
              <TextField
                id="player2-name"
                label="Nickname"
                type="text"
                variant="standard"
                value={playerTwoName}
                error={validate && !validate[1][PlayerFields.NAME]}
                helperText={
                  validate &&
                  !validate[1][PlayerFields.NAME] &&
                  ValidationMessages.NAME
                }
                onChange={(e) => setPlayerTwoName(e.target.value)}
              />
              <TextField
                id="player2-age"
                label="Age"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                variant="standard"
                value={playerTwoAge || ""}
                error={validate && !validate[1][PlayerFields.AGE]}
                helperText={
                  validate &&
                  !validate[1][PlayerFields.AGE] &&
                  ValidationMessages.AGE
                }
                onChange={(e) => setPlayerTwoAge(parseInt(e.target.value))}
              />
            </div>
          </div>
          <Button id="start-game" type="submit" variant="contained">
            Start Game
          </Button>
        </form>
      ) : (
        <Board />
      )}
    </div>
  );
}

export default UserForm;
