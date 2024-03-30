import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const Update = ({ handleCloseDialog, idEmployee }) => {
  const [Employee, setEmployee] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    addressline: '',
    barangay: '',
    province: '',
    country: '',
    zipcode: ''
  })

  const [departments, setDepartments] = useState([]);
  const [designationInput, setDesignationInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [emptypeInput, setEmptypeInput] = useState("Full-Time");

  const navigate = useNavigate()
  const location = useLocation()
  // const idEmployee = location.pathname.split("/")[2]

  useEffect(() => {

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/employee/${idEmployee}`);

        setEmployee(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchEmployee();

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
  }, [idEmployee]);

  useEffect(() => {
    if (Employee.department && departments[Employee.department]) {
      setDesignationInput(departments[Employee.department][0]);
    }
  }, [Employee.department, departments]);

  
  const handleChange = (e) => {
    setEmployee((prev)=>({...prev, [e.target.name]: e.target.value}));
  };

  
  const handleDesignationChange = (event) => {
    setDesignationInput(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusInput(event.target.value);
  };

  const handleEmptypeChange = (event) => {
    setEmptypeInput(event.target.value);
  };

  // const [openAddDialog, setOpenAddDialog] = useState(false);

  // const handleCloseDialog = () => {
  //   setOpenAddDialog(false);
  //   navigate('/');
  //   // forceUpdate();
  // };

  const handleCombinedClick = async () => {
    await handleClick();
    handleCloseDialog(); 
    navigate('/');
    // updateNavigation && updateNavigation();
  };

  // useEffect(() => {
  //   if (selectedidEmployee) {
  //     navigate(`/update/${selectedidEmployee}`);
  //   }
  // }, [selectedidEmployee]);

  // useEffect(() => {
  //   if (selectedidEmployee) {
  //     navigate(`/update/${selectedidEmployee}`);
  //   }
  // }, [selectedidEmployee, navigate]);

  const handleClick = async e => {
    if (e) {
      e.preventDefault();
    }
    const confirmMessage = `Are you sure you want to update the employee with the following details?\n
    First Name: ${Employee.firstname}\n
    Middle Name: ${Employee.middlename}\n
    Last Name: ${Employee.lastname}\n
    Address Line: ${Employee.addressline}\n
    Barangay: ${Employee.barangay}\n
    Province: ${Employee.province}\n
    Country: ${Employee.country}\n
    Zipcode: ${Employee.zipcode}\n
    Department: ${Employee.department}\n
    Designation: ${designationInput}\n
    Status: ${statusInput}\n
    Employee Type: ${emptypeInput}`;
  
    if (window.confirm(confirmMessage)) {
      // e.preventDefault();
    try{
      await axios.put("http://localhost:3002/employee/"+ idEmployee, Employee) 
  
      const designationResponse = await axios.get(`http://localhost:3002/designation_id?name=${designationInput}`);
      const statusResponse = await axios.get(`http://localhost:3002/status_id?name=${statusInput}`);

      const assignData = {
        idEmployee : idEmployee,
        designation_id: designationResponse.data,
        status_id: statusResponse.data,
        employee_type: emptypeInput

      };

      axios.post('http://localhost:3002/assign_designation-update', assignData)
      .then(response => {
          console.log(response.data);
          setDesignationInput("");
          setStatusInput("");
      })
      .catch(error => {
          console.error('There was an error!', error);
      });

      navigate('/') 
    } catch(err){
      console.log(err)
    }
  }
}

  // const handleClickBack = async (e) => {
  //   e.preventDefault();
  //   navigate('/');
  // };

  console.log(Employee)
  return (
    <div className='form'> 
      <h1>Update employee</h1>
        <input type = "text" placeholder = "First Name" value={Employee.firstname} onChange={handleChange} name ="firstname"/>
        <input type = "text" placeholder = "Middle Name" value={Employee.middlename} onChange={handleChange} name="middlename"/>
        <input type = "text" placeholder = "Last Name" value={Employee.lastname} onChange={handleChange} name="lastname"/>
        <input type = "text" placeholder = "Address Line" value={Employee.addressline} onChange={handleChange} name="addressline"/>
        <input type = "text" placeholder = "Barangay" value={Employee.barangay} onChange={handleChange} name="barangay"/>
        <input type = "text" placeholder = "Province" value={Employee.province} onChange={handleChange} name="province"/>
        <input type = "text" placeholder = "country" value={Employee.country} onChange={handleChange} name="country"/>
        <input type = "text" placeholder = "zipcode" value={Employee.zipcode} onChange={handleChange} name="zipcode"/>
      <select name='department' value={Employee.department} onChange={handleChange}>
        {Object.keys(departments).map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
      <select name='designation' value={designationInput} onChange={handleDesignationChange}>
        {Employee.department &&
          departments[Employee.department].map((designation) => (
            <option key={designation} value={designation}>
              {designation}
            </option>
          ))}
      </select>
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

          <button className="formButton" onClick={(e) => handleCombinedClick(e)}>Add employee</button>
          <button className="formButton" onClick={(e) => handleCloseDialog(e)}>Cancel</button>

    </div>
  )
}
 
export default Update