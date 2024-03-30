import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const DepartmentView = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchEmployeesByDepartment(selectedDepartment);
        }
    }, [selectedDepartment]);

    const navigate = useNavigate()


    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`http://localhost:8800/departments-view`);
            setDepartments(res.data);
            if (res.data.length > 0) {
                setSelectedDepartment(res.data[0].dept_name);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchEmployeesByDepartment = async (dept_name) => {
        try {
            const res = await axios.get(`http://localhost:8800/employees/view/${dept_name}`);
            setEmployees(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = () => {
        fetchEmployeesByDepartment(selectedDepartment);
    };

    const handleClickBack = async e => {
        e.preventDefault();
        navigate('/');
        };
    

    return (
        <div className='container'>
            
            <h1><b>DEPARTMENTS</b></h1>
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
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.lastname}</td>
                            <td>{employee.firstname}</td>
                            <td>{employee.dept_name}</td>
                            <td>{employee.designation_name}</td>
                            <td>{employee.status_name}</td>
                            <td>{employee.employee_type}</td>

                            <td className="button-container"> 
                                <button className="update">
                                    <Link to={`/update/${employee.employee_id}`}>Update</Link>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="bottom-nav-dep">
                    <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                        {departments.map((department, index) => (
                            <option key={index} value={department.dept_name}>{department.dept_name}</option>
                        ))}
                    </select>
                        
                        {/* <button className="dep-add" onClick={handleSearch}>SEARCH</button> */}
                        <button className="dep-add" onClick={handleClickBack}>BACK</button>
            </div>
        </div>

    );
};

export default DepartmentView;