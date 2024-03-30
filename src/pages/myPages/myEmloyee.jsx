import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {Dialog, DialogContent} from '@mui/material';
import Add from './Add';
import Update from './myUpdate';
import { useReducer } from 'react';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// const notify = () => toast('Employee deleted successfully!');


const Employee = () => {
  const [Employee, setEmployee] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);  
  const [ignored, forceUpdate] = useReducer(x => x +1, 0 ); 
  // const [updateNavigation, setUpdateNavigation] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);



  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    navigate('/');
    forceUpdate();
  }

  const handleOpenUpdateDialog = (idEmployee) => {
    setOpenUpdateDialog(true);
    console.log(idEmployee);
    // navigate(`/update/${employeeId}`);
    // setUpdateNavigation(() => () => navigate(`/update/${employeeId}`));
    setSelectedEmployeeId(idEmployee);
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
        // notify();
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="container">
      <h1> <b> Employees </b> </h1>
      <table>
        <thead>
          <tr>
            <th className='primary-key'>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Employee.map((employee) => (
            <tr key={employee.idEmployee}>
              <td className='primary-key'>{employee.idEmployee}</td>
              <td>
                {`${employee.firstname} ${employee.middlename} ${employee.lastname}`}
              </td>
              <td>
                {`${employee.addressline} ${employee.barangay} ${employee.province} ${employee.country} ${employee.zipcode}`}
              </td>
              <td  className="button-container">
                <button className="delete"  onClick={() => handleDelete(employee.idEmployee)}>
                  Delete
                </button>

                <button className="update" onClick={() => handleOpenUpdateDialog(employee.idEmployee)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      
      <div className="bottom-nav">
        <Link>
          <button className="add" onClick={handleOpenAddDialog}>
            ADD NEW EMPLOYEE
          </button>
        </Link>

        <Link to="/view">
          <button className="add">
            VIEW BY DEPARTMENT
          </button>
        </Link>
      </div>

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
          <Add handleCloseDialog={handleCloseAddDialog}/>
        </DialogContent>
        </Dialog>

        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
          {/* <Update handleCloseDialog={handleCloseUpdateDialog}/> */}
          <Update handleCloseDialog={handleCloseUpdateDialog} selectedEmployeeId={selectedEmployeeId}  />

        </DialogContent>
        </Dialog>
    </div>
  );
};  

export default Employee