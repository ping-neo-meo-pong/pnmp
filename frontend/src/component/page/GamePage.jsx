import React, { useState, useEffect } from "react";
import axios from "axios";
import Game from "../game/Game";

const GamePage = () => {
  const [games, setGames] = useState([]);

  const getGames = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/game`)
      .then((response) => {
        console.log(response.data);
        setGames(response.data);
      })
      .catch((error) => {
        console.log("실패");
        console.log(error.response);
      });
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <>
      <h1>Game List</h1>
      {games.map((game) => (
        <Game gameInfo={game} key={game.id} />
      ))}
    </>
  );
};

export default GamePage;
