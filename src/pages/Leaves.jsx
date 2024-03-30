import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeavesView = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate()

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

    const handleClickBack = async e => {
        e.preventDefault();
        navigate('/');
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
      <div className='container'>
          <h1><b>LEAVES</b></h1>
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
                          <button className="delete" 
                          onClick={() => handleDelete(employee.leaves_id)}>Delete</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          <div className="bottom-nav-dep">
              <button className="dep-add" onClick={handleClickBack}>BACK</button>
          </div>
      </div>
  );
};

export default LeavesView;