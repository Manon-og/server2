import express from "express"
import mysql2 from "mysql2"
import cors from "cors"

const app = express()

const db = mysql2.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "wakoyuyab",
    database: "m2"
})

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json("Welcome to our application.")
})

app.get("/departments-view", (req, res) => {
    const q = `SELECT * FROM m2.departments;`
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    
    })
})


app.get("/departments", (req, res) => {
    const q = `
        SELECT departments.dept_name, designation.designation_name 
        FROM m2.departments 
        JOIN m2.designation ON departments.departments_id = designation.departments_id;
    `;
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});
app.get("/employees", (req, res) => {
    const q = "SELECT * FROM m2.employees"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    
    })
})

app.get("/employees/:id", (req, res) => {
    const q = "SELECT * FROM m2.employees WHERE employee_id = ?"
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.json(err)
        return res.json(data[0])
    })
})



app.get("/employees/view/:dept_name", (req, res) => { // trying employee type
    const q = `
    SELECT 	
        m2.employees.employee_id,	
        m2.departments.dept_name,
        m2.employees.lastname,
        m2.employees.firstname,
        m2.designation.designation_name,
        m2.status.status_name,
        m2.assign_designation.employee_type
    FROM 
    m2.assign_designation
    INNER JOIN 
        m2.employees ON m2.assign_designation.employee_id = m2.employees.employee_id
    INNER JOIN 
        m2.designation ON m2.assign_designation.designation_id = m2.designation.designation_id
    INNER JOIN
        m2.departments ON m2.designation.departments_id = m2.departments.departments_id
    INNER JOIN 
        m2.status ON m2.assign_designation.status_id = m2.status.status_id
    WHERE
    m2.departments.dept_name = ?;
    `;

    db.query(q, [req.params.dept_name], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });

    
});

app.get("/designation_id", (req, res) => {
    const q = "SELECT designation_id FROM m2.designation WHERE designation_name = ?"
    db.query(q, [req.query.name], (err, data) => {
        if (err) return res.json(err)
        return res.json(data[0].designation_id)
    })
})

app.get("/status_id", (req, res) => {
    const q = "SELECT status_id FROM m2.status WHERE status_name = ?"
    db.query(q, [req.query.name], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.json({ error: 'No status found with that name' })
        return res.json(data[0].status_id)
    })
})

app.get("/leaves", (req, res) => { // leaves view 
    const q = `
    SELECT
    m2.leaves.leaves_id,   
    m2.employees.employee_id,   
    m2.departments.dept_name,
    m2.employees.lastname,
    m2.employees.firstname,
    m2.designation.designation_name,
    m2.status.status_name,
    m2.assign_designation.employee_type,
    m2.leaves.start_leave,
    m2.leaves.end_leave,
    m2.leaves.leave_type,
    m2.leaves.status as leave_status,
    superior_employee.lastname as superior_lastname
FROM 
    m2.assign_designation
LEFT JOIN 
    m2.employees ON m2.assign_designation.employee_id = m2.employees.employee_id
LEFT JOIN 
    m2.designation ON m2.assign_designation.designation_id = m2.designation.designation_id
LEFT JOIN
    m2.departments ON m2.designation.departments_id = m2.departments.departments_id
LEFT JOIN 
    m2.status ON m2.assign_designation.status_id = m2.status.status_id
LEFT JOIN
    m2.signatories ON m2.assign_designation.employee_id = m2.signatories.employee_id
LEFT JOIN
    m2.superior ON m2.signatories.superior_id = m2.superior.superior_id
LEFT JOIN
    m2.employees as superior_employee ON m2.superior.employee_id = superior_employee.employee_id
LEFT JOIN
    m2.leaves ON m2.employees.employee_id = m2.leaves.employee_id;
    `;

    db.query(q, [req.params.dept_name], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });

    
});

app.post("/employees", (req, res) => {
    const q = "INSERT INTO m2.employees (firstname, middlename, lastname, addressline, barangay, province, country, zipcode) VALUES (?)"
    const values = [
        req.body.firstname,
        req.body.middlename,
        req.body.lastname,
        req.body.addressline,
        req.body.barangay,
        req.body.province,
        req.body.country,
        req.body.zipcode
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json({ employees: { employee_id: data.insertId } })
    })
})

app.post("/employees/:employeeId/leaves", (req, res) => { //add leave
    console.log(req.body); 
    const q = "INSERT INTO m2.leaves (employee_id, leave_type, status, start_leave, end_leave) VALUES (?)";
    const values = [
        req.params.employeeId,
        req.body.leaveType,
        req.body.leaveStatus,
        req.body.startDateTime,
        req.body.endDateTime
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json({ leaves: { leave_id: data.insertId } });
    });
});

app.post("/assign_designation", (req, res) => { // trying employee type
    const q = "INSERT INTO m2.assign_designation (employee_id, designation_id, status_id, employee_type) VALUES (?)"
    const values = [
        req.body.employee_id,
        req.body.designation_id,
        req.body.status_id,
        req.body.employee_type
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Designation assigned successfully!")
    })
})

app.post("/assign_designation-update", (req, res) => { // trying employee type
    const q = "UPDATE m2.assign_designation SET designation_id = ?, status_id = ?, employee_type = ? WHERE employee_id = ?"
    const values = [
        req.body.designation_id,
        req.body.status_id,
        req.body.employee_type,
        req.body.employee_id

    ]

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("Designation updated successfully!")
    })
})

app.put("/employees/:id", (req, res) => {
    const employeeId = req.params.id;
    const q = "UPDATE m2.employees SET `firstname`=?, `middlename`=?, `lastname`=?, `addressline`=?, `barangay`=?, `province`=?, `country`=?, `zipcode`=? WHERE employee_id = ?"

    const values = [
        req.body.firstname,
        req.body.middlename,
        req.body.lastname,
        req.body.addressline,
        req.body.barangay,
        req.body.province,
        req.body.country,
        req.body.zipcode
    ]

    db.query(q, [...values,employeeId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Employee updated successfully!")
    })
})

app.delete ("/employees/:id", (req, res) => {
    const employeeId = req.params.id;
    const deleteAssignDesignationQuery = "DELETE FROM m2.assign_designation WHERE employee_id = ?";
    const deleteEmployeeQuery = "DELETE FROM m2.employees WHERE employee_id = ?";
    const deleteLeavesQuery = "DELETE FROM m2.leaves WHERE employee_id = ?";
    const deleteSignatoriesQuery = "DELETE FROM m2.signatories WHERE employee_id = ?";

    db.query(deleteAssignDesignationQuery, employeeId, (err, data) => {
        if (err) return res.json(err);

        db.query(deleteSignatoriesQuery, employeeId, (err, data) => {
            if (err) return res.json(err);

            db.query(deleteLeavesQuery, employeeId, (err, data) => {
                if (err) return res.json(err);

                db.query(deleteEmployeeQuery, employeeId, (err, data) => {
                    if (err) return res.json(err);

                    return res.json("Employee deleted successfully!");
                });
            });
        });
    });
});

app.delete("/leaves/:id", (req, res) => { //delete leaves
    const leaveId = req.params.id;
    const deleteLeaveQuery = "DELETE FROM m2.leaves WHERE leaves_id = ?";

    db.query(deleteLeaveQuery, leaveId, (err, data) => {
        if (err) return res.json(err);
        return res.json("Leave deleted successfully!");
    });
});

app.delete("/superior/:id", (req, res) => { //delete signatory
    const signatoryId = req.params.id;
    const deleteSignatoryQuery = "DELETE FROM m2.signatories WHERE signatories_id = ?";

    db.query(deleteSignatoryQuery, signatoryId, (err, data) => {
        if (err) return res.json(err);
        return res.json("Superior deleted successfully!");
    });
});

app.get("/view-superior", (req, res) => { // superior view 
    const q = `
    SELECT
    m2.signatories.signatories_id,   
    m2.employees.employee_id,   
    m2.departments.dept_name,
    m2.employees.lastname,
    m2.employees.firstname,
    m2.designation.designation_name,
    m2.assign_designation.employee_type,
    superior_employee.lastname as superior_lastname,
    superior_employee.firstname as superior_firstname,
    superior_employee.employee_id as superior_emp_id,
    m2.superior.superior_id,
    m2.signatories.status as signatory_status
    FROM 
        m2.assign_designation
    LEFT JOIN 
        m2.employees ON m2.assign_designation.employee_id = m2.employees.employee_id
    LEFT JOIN 
        m2.designation ON m2.assign_designation.designation_id = m2.designation.designation_id
    LEFT JOIN
        m2.departments ON m2.designation.departments_id = m2.departments.departments_id
    LEFT JOIN 
        m2.status ON m2.assign_designation.status_id = m2.status.status_id
    LEFT JOIN
        m2.signatories ON m2.assign_designation.employee_id = m2.signatories.employee_id
    LEFT JOIN
        m2.superior ON m2.signatories.superior_id = m2.superior.superior_id
    LEFT JOIN
        m2.employees as superior_employee ON m2.superior.employee_id = superior_employee.employee_id
    LEFT JOIN
        m2.leaves ON m2.employees.employee_id = m2.leaves.employee_id;
    `;

    db.query(q, [req.params.dept_name], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });

    
});

app.post("/superior-add", (req, res) => {
    const q = "INSERT INTO m2.signatories (employee_id, superior_id, status) VALUES (?)"
    const values = [
        req.body.employee_id,
        req.body.superior_id,
        req.body.status
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Superior assigned successfully!")
    })
})

app.post("/superior-update", (req, res) => {
    const q = "UPDATE m2.signatories SET superior_id = ?, status = ? WHERE employee_id = ?"
    const values = [
        req.body.superior_id,
        req.body.status,
        req.body.employee_id
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("Superior updated successfully!")
    })
})

app.listen(8800, () => {
    console.log('Connect to backend server!')
    })