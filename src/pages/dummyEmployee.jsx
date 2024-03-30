import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

const Employee = () => {
    const[Employee,setEmployee] = useState([])

    useEffect(() => {
        const fecthAllEmployee = async () => {
            try {
                const res = await axios.get("http://localhost:3002/employee")
                setEmployee(res.data);
            }
            catch(err){
                console.log(err);
            }
        } 
        fecthAllEmployee();
    },[])
       
    const handleDelete = async (id) => {
        try{
           await axios.delete("http://localhost:3002/employee/"+id) 
           window.location.reload()
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div>
        {/* <h1> Employee</h1>
        <div className = 'employees'>
            {Employee.map(emplo => (
                <div key = {emplo.idEmployee}>
                    <h3>{emplo.lastName} {emplo.firstName} {emplo.middleName}</h3>
                    <p>{emplo.employeeNum} {emplo.addressLine} {emplo.barangay} {emplo.province}  {emplo.Country} {emplo.zipCode}</p>
                   </div> 
            ))}
        </div> */}

    <div className="container">
    <h1>Employees Page</h1>
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
        {Employee.map(emplo => (
          <tr key={emplo.idEmployee}>
            <td>{emplo.idEmployee}</td>
            <td>{`${emplo.firstName} ${emplo.middleName} ${emplo.lastName}`}</td>
            <td>{`${emplo.addressLine} ${emplo.barangay} ${emplo.province} ${emplo.Country} ${emplo.zipCode}`}</td>
            <td>
              <button className= "delete" onClick={() => handleDelete(emplo.idEmployee)}>Delete</button>
              <button className= "update"><Link to={`/update/${emplo.idEmployee}`}>Update</Link></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
            <button>
                 <Link to = "/add"> Add new Employee</Link> 
                 </button>
            <button className= "add">
                 <Link to="/department">View by department</Link>
                 </button>
            </div>
        </div>
    );
};

export default Employee
