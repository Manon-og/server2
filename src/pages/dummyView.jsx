import React, { useState } from 'react';
import axios from 'axios';

const DepartmentView = () => {
    const [Employee, setEmployee] = useState([]);
    const [search, setSearch] = useState('');

    const fetchEmployeesByDepartment = async (dept_name) => {
        try {
            const res = await axios.get(`http://localhost:3002/Employee/view/${dept_name}`);
            setEmployee(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = () => {
        fetchEmployeesByDepartment(search);
    };

    return (
        <div>
            <h1>Employees by Department</h1>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <table>
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Status</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentView;