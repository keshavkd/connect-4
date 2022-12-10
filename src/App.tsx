import React, { useState, useEffect } from "react";
import "./App.css";
import UserForm from "./components/UserForm";
import { GameContext } from "./util/GameContext";

function App() {
  const [playerOneName, setPlayerOneName] = useState<string>("");
  const [playerOneAge, setPlayerOneAge] = useState<number>();
  const [playerTwoName, setPlayerTwoName] = useState<string>("");
  const [playerTwoAge, setPlayerTwoAge] = useState<number>();
  const [gameId, setGameId] = useState<number>(1);

  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  // Function to start the timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Function to pause the timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Function to reset the timer
  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  const getTime = () => {
    return `${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds`;
  };

  return (
    <div className="App">
      <GameContext.Provider
        value={{
          playerOneName,
          playerOneAge,
          playerTwoName,
          playerTwoAge,
          setPlayerOneName,
          setPlayerOneAge,
          setPlayerTwoName,
          setPlayerTwoAge,
          seconds,
          setSeconds,
          startTimer,
          pauseTimer,
          resetTimer,
          getTime,
          gameId,
          setGameId,
        }}
      >
        <UserForm />
      </GameContext.Provider>
    </div>
  );
}

export default App;
