/*
 * Score pop-up/modal styles for Material-UI Box component
 *
 * @return :Object
 */
export const boxStyles = () => {
  return {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 250,
    bgcolor: "background.paper",
    borderRadius: "4px",
    boxShadow:
      "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  };
};

// Directions for horizontal, vertical, antidiagonal and diagonal
const directions = [
  [
    [0, 1],
    [0, -1],
  ],
  [
    [1, 0],
    [-1, 0],
  ],
  [
    [1, -1],
    [-1, 1],
  ],
  [
    [1, 1],
    [-1, -1],
  ],
];

/*
 * Function that returns the top most row in a given column where an acceptable
 * move can be made.
 *
 * @param board: number[][], the board in question
 * @param index: number, column index of selected board tile
 *
 * @return :number, highest possible row index or -1 if no move can be made
 */
const getLowestRow = (board: number[][], index: number) => {
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][index] === 0) return i;
  }
  return -1;
};

/*
 * Function that checks immediate neighbors for updating given directional logic board with
 * new sequence value based on neighbor values.
 *
 * @param board: number[][], current board
 * @param index: number, current column index
 * @param playerTurn: number, current player turn to insert correct value to logic board
 * @param winningCount: number, number that is the winning state
 *
 * @return :Object { win: boolean, end: boolean, turns: number, boardx: number[][] }
 */
export const solveBoard = (
  board: number[][],
  index: number,
  turns: number,
  playerTurn: number,
  winningCount: number
) => {
  const rows = board.length;
  const columns = board[0].length;
  let win = false;
  let end = false;
  let lowestRow = getLowestRow(board, index);

  if (lowestRow === -1) return { win, end, turns, boardx: board };

  board[lowestRow][index] = playerTurn === 0 ? 1 : -1;
  turns += 1;

  for (let direction of directions) {
    let forward = checkInDirection(
      board,
      lowestRow,
      index,
      playerTurn,
      direction[0]
    );
    let backward = checkInDirection(
      board,
      lowestRow,
      index,
      playerTurn,
      direction[1]
    );

    if (
      Math.abs(forward[0] - backward[0]) + 1 >= winningCount ||
      Math.abs(forward[1] - backward[1]) + 1 >= winningCount
    ) {
      win = true;
      end = true;
      return {
        win,
        end,
        turns,
        boardx: board,
      };
    }
    if (turns === rows * columns) {
      end = true;
    }
  }

  return {
    win,
    end,
    turns,
    boardx: board,
  };
};

/*
 * Function the checks in given direction to find longest same player tile value
 *
 * @param board: number[][], current board
 * @param rowIndex: number, current row index
 * @param columnIndex: number, current column index
 * @param turn: number, current player turn to find subsequent tile values
 * @param direction: number[], direction to move in current board[row, column]
 *
 * @return :number[], returns array of row and column indices with longest sequence
 *                    of tile values in the direction of same player tile value
 */
const checkInDirection = (
  board: number[][],
  rowIndex: number,
  columnIndex: number,
  turn: number,
  direction: number[]
) => {
  let x = rowIndex;
  let y = columnIndex;
  let value = turn === 0 ? 1 : -1;

  while (
    x >= 0 &&
    x < board.length &&
    y >= 0 &&
    y < board[0].length &&
    board[x][y] === value
  ) {
    x += direction[0];
    y += direction[1];
  }

  return [x - direction[0], y - direction[1]];
};
