import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface IScore {
  playerOneName: string;
  playerOneAge: number;
  playerTwoName: string;
  playerTwoAge: number;
  numberOfTurns: number;
  winner: boolean;
  seconds: number;
  minutes: number;
}

/*
 * Function to render scoreboard in the form of a table
 * @param results: IScore[], Array of board and score related information
 * @return :JXS
 */
const scoreBoardTable = (results: IScore[]) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="scoreboard">
        <TableHead>
          <TableRow>
            <TableCell>Player 1</TableCell>
            <TableCell>Player 2</TableCell>
            <TableCell>Winner</TableCell>
            <TableCell>Number of Moves</TableCell>
            <TableCell>Total Game Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((row, index) => (
            <TableRow
              key={`result-${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{row.playerOneName}</TableCell>
              <TableCell>{row.playerTwoName}</TableCell>
              <TableCell>
                {row.winner !== undefined
                  ? row.winner
                    ? row.playerTwoName
                    : row.playerOneName
                  : "Draw"}
              </TableCell>
              <TableCell>{row.numberOfTurns}</TableCell>
              <TableCell>
                {row.minutes} minutes {row.seconds} seconds
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/*
 * Default Scoreboard export function which hosts the main rendering components for the scoreboard
 * @return :JSX
 */
function Scoreboard(props: { setShowScoreboard: any }) {
  const [results, setResults] = useState<IScore[]>([]);

  /*
   * ComponentOnMount method to get all scores from local storage and sets it to results
   */
  useEffect(() => {
    let scoreboardResults = localStorage.getItem("scoreboard");
    if (scoreboardResults) setResults(JSON.parse(scoreboardResults));
  }, []);

  return (
    <div id="score-board">
      <div id="score-wrapper">
        <h1 id="score-title">Scoreboard</h1>
        <Button
          id="close-score"
          variant="outlined"
          color="error"
          onClick={() => props.setShowScoreboard(false)}
        >
          close scoreboard
        </Button>
      </div>
      {scoreBoardTable(results)}
    </div>
  );
}

export default Scoreboard;
