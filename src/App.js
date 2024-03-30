import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Employees from './pages/Employees';
import Add from './pages/Add';
import Update from './pages/Update';
import './App.css';
// import './Employee.css';
import View from './pages/View'; 
import Leaves from './pages/Leaves';
import AddLeave from './pages/AddLeave';
import Superior from './pages/Superior';




function App() {
  return (
    <div className="App" >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Employees/>} />
          <Route path="/add" element={<Add/>} />
          <Route path="/update/:id" element={<Update/>} />
          <Route path="/view" element={<View/>} />
          <Route path="/leaves" element={<Leaves/>} />
          <Route path="/addLeaves/:id" element={<AddLeave/>} />
          <Route path="/superior" element={<Superior/>} /> 
        </Routes>
      </BrowserRouter>
    </div>
     
  );
}

export default App;