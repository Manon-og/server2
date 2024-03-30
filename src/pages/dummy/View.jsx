import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const DepartmentView = () => {
    const [Employee, setEmployee] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

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
        <div>
            <h1>Employee by Department</h1>
            <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                {departments.map((department, index) => (
                    <option key={index} value={department.dept_name}>{department.dept_name}</option>
                ))}
            </select>
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleClickBack}>Back</button>

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
                            <td>{employee.lastName}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.dept_name}</td>
                            <td>{employee.designation_name}</td>
                            <td>{employee.status_name}</td>
                            <td>{employee.employee_type}</td>
                            <td> <button className="update"><Link to={`/update/${employee.idEmployee}`}>Update</Link>
                            </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentView;