import React from "react";

const Game = ({ gameInfo }) => {
  if (!gameInfo || gameInfo === {}) return <h2>gameInfo is Loading...</h2>;
  return (
    <header>
      <h4>
        NO.{gameInfo.id} GAME
        <br></br>
        CreatedAt: {gameInfo.createdAt}
        <br></br>
        UpdatedAt: {gameInfo.updatedAt}
      </h4>
    </header>
  );
};

export default Game;
