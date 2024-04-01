import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LeavesView = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployeesWithLeaves();
    }, []);

    const fetchEmployeesWithLeaves = async () => {
        try {
            const res = await axios.get(`http://localhost:8800/leaves`);
            setEmployees(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (leaveId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
          try {
            await axios.delete(`http://localhost:8800/leaves/${leaveId}`);
            fetchEmployeesWithLeaves(); // Refresh the list after deleting
            window.location.reload();
          } catch (err) {
            console.log(err);
          }
        }
    };

    return (
        <div className="container">
            <div className="sidebar">
                <img src={process.env.PUBLIC_URL + '/LOGO.jpg'} alt="Logo" className='logo'/>
                <div className="botton-nav">
                <Link to="/" className="main-nav">
                    EMPLOYEES
                </Link>
                <Link to="/view" className="main-nav">
                    VIEW BY DEPARTMENT
                </Link>
                <Link to="/leaves" className="main-nav">
                    VIEW BY LEAVES
                </Link>
                <Link to="/superior" className="main-nav">
                    VIEW SUPERIOR
                </Link>
                </div>
            </div>
            <div className='main-content'>
                <h1 className="header-left">LEAVES</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Leave ID</th>
                            <th>Employee ID</th>
                            <th>Department</th>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Designation</th>
                            <th>Status</th>
                            <th>Employee Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Leave Type</th>
                            <th>Leave Status</th>
                            <th>Superior Last Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={index}>
                                <td>{employee.leaves_id}</td>
                                <td>{employee.employee_id}</td>
                                <td>{employee.dept_name}</td>
                                <td>{employee.lastname}</td>
                                <td>{employee.firstname}</td>
                                <td>{employee.designation_name}</td>
                                <td>{employee.status_name}</td>
                                <td>{employee.employee_type}</td>
                                <td>{new Date(employee.start_leave).toLocaleString().replace(/,/, '')}</td>
                                <td>{new Date(employee.end_leave).toLocaleString().replace(/,/, '')}</td>
                                <td>{employee.leave_type}</td>
                                <td>{employee.leave_status}</td>
                                <td>{employee.superior_lastname}</td>
                                <td className="button-container"> 
                                    <div className="action-btn" onClick={() => handleDelete(employee.leaves_id)}>
                                        DELETE
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="bottom-nav-dep">
                    <Link to="/" className="add-btn">
                        <h1><b>BACK</b></h1>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LeavesView;