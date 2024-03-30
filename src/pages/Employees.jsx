import React, { useEffect, useState, useReducer } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {Dialog, DialogContent} from '@mui/material';
import Add from './Add';
import Update from './Update';
import AddLeave from './AddLeave';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);  
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [ignored, forceUpdate] = useReducer(x => x +1, 0 ); 
  const navigate = useNavigate()

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    navigate('/');
    forceUpdate();
  }

  const handleOpenUpdateDialog = (employee_id) => {
    setOpenUpdateDialog(true);
    setSelectedEmployeeId(employee_id);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    navigate('/');
    forceUpdate();
  };

  const handleOpenLeaveDialog = () => {
    setOpenLeaveDialog(true);
  };

  const handleCloseLeaveDialog = () => {
    setOpenLeaveDialog(false);
    navigate('/');
    forceUpdate();
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8800/employees");
        setEmployees(res.data);
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
        await axios.delete("http://localhost:8800/employees/" + id);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container">
      <h1><b>EMPLOYEES</b></h1>
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
          {employees.map((employee) => (
            <tr key={employee.employee_id}>
              <td className='primary-key'>{employee.employee_id}</td>
              <td>
                {`${employee.firstname} ${employee.middlename} ${employee.lastname}`}
              </td>
              <td>
                {`${employee.addressline} ${employee.barangay} ${employee.province} ${employee.country} ${employee.zipcode}`}
              </td>
              <td className="button-container">
                <button className="delete" onClick={() => handleDelete(employee.employee_id)}>
                  Delete
                </button>

                <button className="update" onClick={() => handleOpenUpdateDialog(employee.employee_id)}>Update</button>

                {/* <button className="update">
                  <Link to={`/update/${employee.employee_id}`}>Update</Link>
                </button> */}

                <button className="update" onClick={() => handleOpenLeaveDialog(employee.employee_id)}>Add Leave</button>

                {/* <button className="update">
                  <Link to={`/addLeaves/${employee.employee_id}`}>Add Leave</Link>
                </button> */}

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
        <Link to="/leaves">
          <button className="add">
            VIEW BY LEAVES
          </button>
        </Link>
        <Link to="/superior">
          <button className="add">
            VIEW SUPERIOR
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

        <Dialog open={openLeaveDialog} onClose={handleCloseLeaveDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
        <AddLeave handleCloseDialog={handleCloseLeaveDialog} selectedEmployeeId={selectedEmployeeId}  />
        </DialogContent>
        </Dialog>

    </div>
  );
};

export default Employees;