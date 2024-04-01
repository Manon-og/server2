import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const AddLeave = ({ handleCloseDialog, selectedEmployeeId}) => {
  const [leave, setLeave] = useState({
    leaveType: 'Sick',
    leaveStatus: 'Active',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  })

  const navigate = useNavigate()
  // const location = useLocation()
  // const employeeId = location.pathname.split("/")[2]

  const handleChange = (e) => {
    setLeave(prev => {
      const updatedLeave = {...prev, [e.target.name]: e.target.value};
  
      if (e.target.name === 'startDate' || e.target.name === 'startTime') {
        if (updatedLeave.startDate && updatedLeave.startTime) {
          updatedLeave.startDateTime = `${updatedLeave.startDate} ${updatedLeave.startTime}:00`;
        }
      } else if (e.target.name === 'endDate' || e.target.name === 'endTime') {
        if (updatedLeave.endDate && updatedLeave.endTime) {
          updatedLeave.endDateTime = `${updatedLeave.endDate} ${updatedLeave.endTime}:00`;
        }
      }
  
      return updatedLeave;
    });
  };

  const handleCombinedClick = async () => {
    await handleClick();
    handleCloseDialog(); 
    navigate('/');
  };

  const handleClick = async e => {
    if (e) {
      e.preventDefault();
    }
    const confirmMessage = `Are you sure you want to add a leave with the following details?\n
    Leave Type: ${leave.leaveType}\n
    Leave Status: ${leave.leaveStatus}\n
    Start Date: ${leave.startDate}\n
    Start Time: ${leave.startTime}\n
    End Date: ${leave.endDate}\n
    End Time: ${leave.endTime}\n`;
  
    if (window.confirm(confirmMessage)) {
      try{
        await axios.post(`http://localhost:8800/employees/${selectedEmployeeId}/leaves`, leave) 
        navigate('/') 
      } catch(err){
        console.log(err)
      }
    }
  }

  // const handleClickBack = async e => {
  //   e.preventDefault();
  //   navigate('/');
  // };

  return (
    <div className='form'> 
      <h1>Add Leave</h1>
      <select name="leaveType" value={leave.leaveType} onChange={handleChange}>
        <option value="Sick">Sick</option>
        <option value="Vacation">Vacation</option>
        <option value="Maternity">Maternity</option>
        <option value="Paternity">Paternity</option>
    </select>
      <select name="leaveStatus" value={leave.leaveStatus} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Denied">Denied</option>
        <option value="Pending">Pending</option>
      </select>
      <input type="date" placeholder="Start Date" value={leave.startDate} onChange={handleChange} name="startDate"/>
      <input type="time" placeholder="Start Time" value={leave.startTime} onChange={handleChange} name="startTime"/>
      <input type="date" placeholder="End Date" value={leave.endDate} onChange={handleChange} name="endDate"/>
      <input type="time" placeholder="End Time" value={leave.endTime} onChange={handleChange} name="endTime"/>
      <div className="bottom-nav">
        <button className="add" onClick={(e) => handleCombinedClick(e)}>Add</button>
        <button className="add" onClick={(e) => handleCloseDialog(e)}>Cancel</button>
      </div>
    </div>
  )
}
 
export default AddLeave;