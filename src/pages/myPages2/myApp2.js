import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Add from "./pages/Add";
import Employees from './pages/Employees';
import Update from './pages/Update';
import View from './pages/View';
import Leaves from './pages/Leaves';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Employees />} />
          <Route path="/add" element={<Add />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/view" element={<View />} />
          <Route path="/leaves/:id" element={<Leaves />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
