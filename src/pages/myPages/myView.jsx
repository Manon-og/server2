import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Update from './Update';
import {Dialog, DialogContent} from '@mui/material';
import { useReducer } from 'react';

const DepartmentView = () => {
    const [Employee, setEmployee] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [ignored, forceUpdate] = useReducer(x => x +1, 0 ); 
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);  
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);


    const handleOpenUpdateDialog = (idEmployee) => {
        setOpenUpdateDialog(true);
        // navigate(`/update/${employeeId}`);
        // setUpdateNavigation(() => () => navigate(`/update/${employeeId}`));
        setSelectedEmployeeId(idEmployee);
      };
      
      const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        navigate('/');
        // forceUpdate();
      };

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchEmployeeByDepartment(selectedDepartment);
        }
    }, [selectedDepartment]);

    const navigate = useNavigate()

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`http://localhost:3002/departments-view`);
            setDepartments(res.data);
            if (res.data.length > 0) {
                setSelectedDepartment(res.data[0].dept_name);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchEmployeeByDepartment = async (dept_name) => {
        try {
            const res = await axios.get(`http://localhost:3002/employee/view/${dept_name}`);
            setEmployee(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = () => {
        fetchEmployeeByDepartment(selectedDepartment);
    };

    const handleClickBack = async e => {
        e.preventDefault();
        navigate('/');
        };

    return (
        <div className='container'>
            <h1> <b>  Employee by Department </b> </h1>
            <table>
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Status</th>
                        <th>Employee Type</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {Employee.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.lastname}</td>
                            <td>{employee.firstname}</td>
                            <td>{employee.dept_name}</td>
                            <td>{employee.designation_name}</td>
                            <td>{employee.status_name}</td>
                            <td>{employee.employee_type}</td>
                           
                            <td className="button-container"> 
                            <button className="update" onClick={() => handleOpenUpdateDialog(employee.idEmployee)}>
                             Update
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ height: '1000px' }}>
          {/* <Update handleCloseDialog={handleCloseUpdateDialog}/> */}
          <Update handleCloseDialog={handleCloseUpdateDialog} selectedEmployeeId={selectedEmployeeId}  />
        </DialogContent>
        </Dialog>

        <div className="bottom-nav-dep">
        <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                {departments.map((department, index) => (
                    <option key={index} value={department.dept_name}>{department.dept_name}</option>
                ))}
            </select>
            {/* <button className='dep-add' onClick={handleSearch}>Search</button> */}
            <button className='dep-add' onClick={handleClickBack}>Back</button>
        </div>

        </div>
    );
};

export default DepartmentView