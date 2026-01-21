import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddClothingItem from "./pages/AddClothingItem";
import Wardrobe from "./pages/Wardrobe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wardrobe/add" element={<AddClothingItem />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
      </Routes>
    </Router>
  );
}

export default App;