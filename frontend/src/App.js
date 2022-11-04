import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GamePage from "./component/page/GamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
