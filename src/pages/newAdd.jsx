import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

const Add = () => {
  const [Employee, setEmployee] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    addressLine: '',
    barangay: '',
    province: '',
    Country: '',
    zipCode: '',
  })

  const [departments, setDepartments] = useState([]);
  const [designationInput, setDesignationInput] = useState("");
  const [statusInput, setStatusInput] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:3002/departments');
        const departments = res.data.reduce((acc, curr) => {
          if (!acc[curr.dept_name]) {
            acc[curr.dept_name] = [];
          }
          acc[curr.dept_name].push(curr.designation_name);
          return acc;
        }, {});
        setDepartments(departments);
        const firstDepartment = Object.keys(departments)[0];
        setEmployee(prevState => ({ ...prevState, department: firstDepartment }));
        setDesignationInput(departments[firstDepartment][0]);
        setStatusInput("Active");
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setEmployee((prev)=>({...prev, [e.target.name]: e.target.value}));
  };

  

  const handleDesignationChange = (event) => {
    setDesignationInput(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusInput(event.target.value);
  };

  const navigate = useNavigate()

  const handleClick = async e => {
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:3002/employee", Employee);
      console.log(response.status); 
      console.log(response.data);  
      const employeeId = response.data.Employee.idEmployee; 
      console.log(employeeId); 

      const designationResponse = await axios.get(`http://localhost:3002/designation_id?name=${designationInput}`);
      const statusResponse = await axios.get(`http://localhost:3002/status_id?name=${statusInput}`);

      const assignData = {
        idEmployee: employeeId,
        designation_id: designationResponse.data,
        status_id: statusResponse.data
    };

    

    axios.post('http://localhost:3002/assign_designation', assignData)
    .then(response => {
        console.log(response.data);
        setDesignationInput("");
        setStatusInput("");
    })
    .catch(error => {
        console.error('There was an error!', error);
    });

navigate('/');
     
    } catch(err){
      console.log(err)
    }
  }

  const handleClickBack = async e => {
    e.preventDefault();
    navigate('/');
    };

  console.log(Employee)
  return (
    <div className='form'>
      <h1>Registration Form</h1>
          <input type = "text" placeholder = "First Name"  onChange={handleChange} name ="firstName"/>
          <input type = "text" placeholder = "Middle Name" onChange={handleChange} name="middleName"/>
          <input type = "text" placeholder = "Last Name" onChange={handleChange} name="lastName"/>
          <input type = "text" placeholder = "Address Line" onChange={handleChange} name="addressLine"/>
          <input type = "text" placeholder = "Barangay" onChange={handleChange} name="barangay"/>
          <input type = "text" placeholder = "Province" onChange={handleChange} name="province"/>
          <input type = "text" placeholder = "Country" onChange={handleChange} name="Country"/>
          <input type = "text" placeholder = "Zipcode" onChange={handleChange} name="zipCode"/>

          <select name='department' value={Employee.department} onChange={handleChange}>
  {Object.keys(departments).map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ))}
</select>

{Employee.department && departments[Employee.department] && designationInput && (
  <select name='designation' value={designationInput} onChange={handleDesignationChange}>
    {departments[Employee.department].map((designation) => (
      <option key={designation} value={designation}>
        {designation}
      </option>
    ))}
  </select>
)}

          <select name="status" id={statusInput} onChange={handleStatusChange}>
            <option value="Active">Active</option>
            <option value="Resign">Resign</option>
            <option value="A.W.O.L">A.W.O.L</option>
          </select>

          <button className="formButton" onClick={handleClick}>Add Employee</button>
          <button className="formButton" onClick={handleClickBack}>Cancel</button>


    </div>
  )
}

export default Add