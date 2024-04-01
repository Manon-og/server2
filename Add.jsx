import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

const Add = ({handleCloseDialog}) => {
  const [employee, setEmployees] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    addressline: '',
    barangay: '',
    province: '',
    country: '',
    zipcode: '',
  })

  const [departments, setDepartments] = useState([]);
  const [designationInput, setDesignationInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [emptypeInput, setEmptypeInput] = useState("Full-Time");

  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:8800/departments');
      const departments = res.data.reduce((acc, curr) => {
        if (!acc[curr.dept_name]) {
          acc[curr.dept_name] = [];
        }
        acc[curr.dept_name].push(curr.designation_name);
        return acc;
      }, {});
      setDepartments(departments);
      const firstDepartment = Object.keys(departments)[0];
      setEmployees(prevState => ({ ...prevState, department: firstDepartment }));
      setDesignationInput(departments[firstDepartment][0]);
      setStatusInput("Active");
    } catch (err) {
      console.log(err);
    }
  };

  fetchDepartments();
}, []);

useEffect(() => {
  if (employee.department && departments[employee.department]) {
    setDesignationInput(departments[employee.department][0]);
  }
}, [employee.department, departments]);

  const handleChange = (e) => {
    setEmployees((prev)=>({...prev, [e.target.name]: e.target.value}));
  };

  const handleEmptypeChange = (event) => {
    setEmptypeInput(event.target.value);
  };

  const handleDesignationChange = (event) => {
    setDesignationInput(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusInput(event.target.value);
  };

  const handleCombinedClick = async () => {
    await handleClick();
    handleCloseDialog();
    navigate('/');
  };

  const navigate = useNavigate()

  const handleClick = async e => {
    if (e) {
      e.preventDefault();
    }
    for (let key in employee) {
      if (employee[key] === '') {
        alert('Please fill all fields');
        return;
      }
    }
    try{
      const response = await axios.post("http://localhost:8800/employees", employee);
      console.log(response.status); 
      console.log(response.data);  
      const employeeId = response.data.employees.employee_id; 
      console.log(employeeId); 

      const designationResponse = await axios.get(`http://localhost:8800/designation_id?name=${designationInput}`);
      const statusResponse = await axios.get(`http://localhost:8800/status_id?name=${statusInput}`);

      const assignData = {
        employee_id: employeeId,
        designation_id: designationResponse.data,
        status_id: statusResponse.data,
        employee_type: emptypeInput
    };

    

    axios.post('http://localhost:8800/assign_designation', assignData)
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

  // const handleClickBack = async e => {
  //   e.preventDefault();
  //   navigate('/');
  //   };

  console.log(employee)
  return (
    <div className='form'>
      <h1>Registration Form</h1>
          <input type = "text" placeholder = "First Name"  onChange={handleChange} name ="firstname" required/>
          <input type = "text" placeholder = "Middle Name" onChange={handleChange} name="middlename" required/>
          <input type = "text" placeholder = "Last Name" onChange={handleChange} name="lastname" required/>
          <input type = "text" placeholder = "Address Line" onChange={handleChange} name="addressline" required/>
          <input type = "text" placeholder = "Barangay" onChange={handleChange} name="barangay" required/>
          <input type = "text" placeholder = "Province" onChange={handleChange} name="province" required/>
          <input type = "text" placeholder = "Country" onChange={handleChange} name="country" required/>
          <input type = "text" placeholder = "Zipcode" onChange={handleChange} name="zipcode" required/>

          <select name='department' value={employee.department} onChange={handleChange}>
  {Object.keys(departments).map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ))}
</select>

{employee.department && departments[employee.department] && designationInput && (
  <select name='designation' value={designationInput} onChange={handleDesignationChange}>
    {departments[employee.department].map((designation) => (
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

          <select name="emptype" id={emptypeInput} onChange={handleEmptypeChange}>
            <option value="Full-Time">Full-Time</option>
            <option value="Intern">Intern</option>
            <option value="Part-Time">Part-Time</option>
          </select>
         
          <div className="bottom-nav">
            <button className="add" onClick={(e) => handleCombinedClick(e)}>Register</button>
            <button className="add" onClick={(e) => handleCloseDialog(e)}>Cancel</button>
          </div>
    </div>
  )
}

export default Add