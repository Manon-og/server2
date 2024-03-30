import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const Leaves = () => {
    const [leave, setLeave] = useState({
        employee_id: '', 
        leave_type: 'Vacation',
        start_date: '',
        end_date: '',
        status: 'Pending'
      })

  const { id: employeeId } = useParams();
  const navigate = useNavigate()

  const handleChange = (e) => {
    setLeave((prev)=>({...prev, [e.target.name]: e.target.value}));
  };

  const handleLeaveTypeChange = (event) => {
    setLeave(prev => ({ ...prev, leave_type: event.target.value }));
  };
  
  const handleStatusChange = (event) => {
    setLeave(prev => ({ ...prev, status: event.target.value }));
  };

  const handleClick = async e => {
    e.preventDefault();
    try{
      const response = await axios.post(`http://localhost:8800/leaves/${employeeId}`, {
        employee_id: leave.employee_id, 
        start_leave: leave.start_date,
        end_leave: leave.end_date,
        leave_type: leave.leave_type, 
        status: leave.status 
      });
      console.log(response.status); 
      console.log(response.data);  
      navigate('/');
    } catch(err){
      console.log(err)
    }
  }
  const handleClickBack = async e => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className='form'>
      <h1>Leave Application Form</h1>
    
      
      <select name="leave_type" value={leave.leave_type} onChange={handleLeaveTypeChange}>
        <option value="Vacation">Vacation</option>
        <option value="Sick">Sick</option>
        <option value="Maternity">Maternity</option>
        <option value="Paternity">Paternity</option>
      </select>
  
      <input type = "date" placeholder = "Start Date" onChange={handleChange} name="start_date"/>
      <input type = "date" placeholder = "End Date" onChange={handleChange} name="end_date"/>
      
      <select name="status" value={leave.status} onChange={handleStatusChange}>
        <option value="Approved">Approved</option>
        <option value="Denied">Denied</option>
        <option value="Pending">Pending</option>
      </select>
  

      <button className="formButton" onClick={handleClick}>Apply for Leave</button>
      <button className="formButton" onClick={handleClickBack}>Cancel</button>
    </div>
  )
}

export default Leaves