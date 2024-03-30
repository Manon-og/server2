import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Superiors = () => {
  const [superiors, setSuperiors] = useState([]);
  const [empId, setEmpId] = useState('');
  const [superiorEmpId, setSuperiorEmpId] = useState('');
  const [updateStatus, setUpdateStatus] = useState('Active');

  const fetchSuperiors = async () => {
    try {
      const res = await axios.get("http://localhost:8800/view-superior");
      setSuperiors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSuperiors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(empId, superiorEmpId, updateStatus);

    if (empId === '' || superiorEmpId === '' ) {
        alert('Please fill all fields');
        return;
    }

    try {
        await axios.post("http://localhost:8800/superior-add", {
          employee_id: empId,
          superior_id: superiorEmpId,
          status: 'Active'
          
        });
        alert('Superior assigned successfully!');
        setEmpId('');
        setSuperiorEmpId('');
        setUpdateStatus('active');
        fetchSuperiors();
      } catch (err) {
        console.log(err);

        
      }  };

      const handleUpdate = async (event) => {
        event.preventDefault();
      
        // Check if all fields are filled
        if (empId === '' || superiorEmpId === '') {
          alert('Please fill all fields');
          return;
        }
      
        const confirmMessage = `Are you sure you want to update the superior with the following details?\n
        Employee ID: ${empId}\n
        Superior ID: ${superiorEmpId}\n
        Status: ${updateStatus}`;
      
        if (window.confirm(confirmMessage)) {
          try {
            await axios.post("http://localhost:8800/superior-update", {
              employee_id: empId,
              superior_id: superiorEmpId,
              status: updateStatus
            });
            alert('Superior updated successfully!');
            setEmpId('');
            setSuperiorEmpId('');
            setUpdateStatus('Active');
            fetchSuperiors(); // Refresh the data
          } catch (err) {
            console.log(err);
          }
        }
      };

      const handleDelete = async (signatoryID) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (confirmDelete) {
          try {
            await axios.delete(`http://localhost:8800/superior/${signatoryID}`);
            fetchSuperiors(); // Refresh the list after deleting
            window.location.reload();
          } catch (err) {
            console.log(err);
          }
        }
      };

  return (
    <div className="container">
      <h1><b>EMPLOYEES AND THEIR SUPERIORS</b></h1>
      <table>
        <thead>
          <tr>
          <th>SIGNATORY ID</th>
            <th className='primary-key'>EMP ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Superior ID</th>
            <th>Superior Emp ID</th>
            <th>Superior</th>
            <th>Signatory Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {superiors.map((superior) => (
            <tr key={superior.employee_id}>
                <td>{superior.signatories_id}</td>
              <td className='primary-key'>{superior.employee_id}</td>
              <td>
                {`${superior.firstname} ${superior.lastname}`}
              </td>
              <td>{superior.designation_name}</td>
              <td>{superior.superior_id}</td>
              <td>{superior.superior_emp_id}</td>
              <td>
                {`${superior.superior_firstname} ${superior.superior_lastname}`}
              </td>
              <td>{superior.signatory_status}</td>
              <td className="button-container">
                <button className="delete" onClick={() => handleDelete(superior.signatories_id)}>
                  Delete
                </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='bottom-nav'> 
        <h3>Add Signatory</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Enter Emp ID:
            <input type="text" value={empId} onChange={(e) => setEmpId(e.target.value)} />
          </label>
          <label>
            Enter Superior ID:
            <input type="text" value={superiorEmpId} onChange={(e) => setSuperiorEmpId(e.target.value)} />
          </label>
          <label>
          Update Status:
          <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
          <div className="bottom-nav">
            <button type="submit">Add Superior</button>
            <button type="button" onClick={handleUpdate}>Update Superior</button>
          </div>
        </form>
      </div>

      

      


    </div>
  );
};

export default Superiors;