import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {Dialog, DialogContent} from '@mui/material';
import Add from './Add';
import Update from './Update';
import { useReducer } from 'react';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// const notify = () => toast("Wow so easy!");

const Employee = () => {
  const [Employee, setEmployee] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);  
  const [ignored, forceUpdate] = useReducer(x => x +1, 0 ); 

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    navigate('/');
    forceUpdate();
  };

  const handleOpenUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };
  
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    navigate('/');
    forceUpdate();
  };

  // const handleCloseUpdate = () => {
  //   handleCloseUpdateDialog(); 
  //   navigate('/');
  // };

  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:3002/employee");
        setEmployee(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEmployees();
  }, [ignored]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        await axios.delete("http://localhost:3002/employee/" + id);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="container">
      <h1>Employees</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Employee.map((employee) => (
            <tr key={employee.idEmployee}>
              <td>{employee.idEmployee}</td>
              <td>
                {`${employee.firstName} ${employee.middleName} ${employee.lastName}`}
              </td>
              <td>
                {`${employee.addressLine} ${employee.barangay} ${employee.province} ${employee.Country} ${employee.zipCode}`}
              </td>
              <td>
                <button className="delete" onClick={() => handleDelete(employee.idEmployee)}>
                  Delete
                </button>

                <button className="update">
                <Link to={`/update/${employee.idEmployee}`}>Update</Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bottom-nav">
      <button className="add" onClick={handleOpenAddDialog}>
          Add new employee
      </button>

      <button className="add">
          <Link to="/view">View by department</Link>
      </button>

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
          <Add handleCloseDialog={handleCloseAddDialog}/>
        </DialogContent>
        </Dialog>

        {/* <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
          <Update handleCloseDialog={handleCloseUpdateDialog}/>
        </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};  

export default Employee;