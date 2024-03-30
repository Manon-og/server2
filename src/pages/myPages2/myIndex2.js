import express from "express"
import mysql2 from "mysql2"
import cors from "cors"

const app = express()

const db = mysql2.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "wakoyuyab",
    database: "EventDriven"
})

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json("Welcome to our application.")
})

app.get("/departments-view", (req, res) => {
    const q = `SELECT * FROM EventDriven.departments;`
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    
    })
})


app.get("/departments", (req, res) => {
    const q = `
        SELECT departments.dept_name, designation.designation_name 
        FROM EventDriven.departments 
        JOIN EventDriven.designation ON departments.departments_id = designation.departments_id;
    `;
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});
app.get("/employees", (req, res) => {
    const q = "SELECT * FROM EventDriven.employees"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    
    })
})

app.get("/employees/:id", (req, res) => {
    const q = "SELECT * FROM EventDriven.employees WHERE employee_id = ?"
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.json(err)
        return res.json(data[0])
    })
})



app.get("/employees/view/:dept_name", (req, res) => { // trying employee type
    const q = `
    SELECT 	
        EventDriven.employees.employee_id,	
        EventDriven.departments.dept_name,
        EventDriven.employees.lastname,
        EventDriven.employees.firstname,
        EventDriven.designation.designation_name,
        EventDriven.status.status_name,
        EventDriven.assign_designation.employee_type
    FROM 
    EventDriven.assign_designation
    INNER JOIN 
        EventDriven.employees ON EventDriven.assign_designation.employee_id = EventDriven.employees.employee_id
    INNER JOIN 
        EventDriven.designation ON EventDriven.assign_designation.designation_id = EventDriven.designation.designation_id
    INNER JOIN
        EventDriven.departments ON EventDriven.designation.departments_id = EventDriven.departments.departments_id
    INNER JOIN 
        EventDriven.status ON EventDriven.assign_designation.status_id = EventDriven.status.status_id
    WHERE
    EventDriven.departments.dept_name = ?;
    `;

    db.query(q, [req.params.dept_name], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });

    
});

app.get("/designation_id", (req, res) => {
    const q = "SELECT designation_id FROM EventDriven.designation WHERE designation_name = ?"
    db.query(q, [req.query.name], (err, data) => {
        if (err) return res.json(err)
        if (!data || data.length === 0) return res.json({ error: 'No designation found with that name' })
        return res.json(data[0].designation_id)
    })
})



app.get("/status_id", (req, res) => {
    const q = "SELECT status_id FROM EventDriven.status WHERE status_name = ?"
    db.query(q, [req.query.name], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.json({ error: 'No status found with that name' })
        return res.json(data[0].status_id)
    })
})

app.post("/employees", (req, res) => {
    const q = "INSERT INTO EventDriven.employees (firstname, middlename, lastname, addressline, barangay, province, country, zipcode) VALUES (?)"
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

app.post("/assign_designation", (req, res) => { // trying employee type
    const q = "INSERT INTO EventDriven.assign_designation (employee_id, designation_id, status_id, employee_type) VALUES (?)"
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
    const q = "UPDATE EventDriven.assign_designation SET designation_id = ?, status_id = ?, employee_type = ? WHERE employee_id = ?"
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
    const q = "UPDATE EventDriven.employees SET `firstname`=?, `middlename`=?, `lastname`=?, `addressline`=?, `barangay`=?, `province`=?, `country`=?, `zipcode`=? WHERE employee_id = ?"

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

app.delete("/employees/:id", (req, res) => {
    const employeeId = req.params.id;
    const deleteAssignDesignationQuery = "DELETE FROM EventDriven.assign_designation WHERE employee_id = ?";
    const deleteEmployeeQuery = "DELETE FROM EventDriven.employees WHERE employee_id = ?";
    const deleteLeavesQuery = "DELETE FROM EventDriven.leaves WHERE employee_id = ?"; // New query to delete leaves

    db.query(deleteAssignDesignationQuery, employeeId, (err, data) => {
        if (err) return res.json(err);

        db.query(deleteLeavesQuery, employeeId, (err, data) => { // Execute the delete leaves query
            if (err) return res.json(err);

            db.query(deleteEmployeeQuery, employeeId, (err, data) => {
                if (err) return res.json(err);
                return res.json("Employee and associated leaves deleted successfully!");
            });
        });
    });
});

app.post("/leaves/:id", (req, res) => {
    const { start_leave, end_leave, leave_type, status } = req.body;
    const employee_id = req.params.id; 
    const insertLeaveQuery = "INSERT INTO leaves (employee_id, start_leave, end_leave, leave_type, status) VALUES (?, ?, ?, ?, ?)";

    db.query(insertLeaveQuery, [employee_id, start_leave, end_leave, leave_type, status], (err, data) => {
        if (err) return res.json(err);
        return res.json("Leave inserted successfully!");
    });
});

app.listen(8800, () => {
    console.log('Connect to backend server!')
    })
