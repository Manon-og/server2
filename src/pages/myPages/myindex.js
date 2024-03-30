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
app.get("/employee", (req, res) => {
    const q = "SELECT * FROM EventDriven.Employee"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    
    })
})

app.get("/employee/:id", (req, res) => {
    const q = "SELECT * FROM EventDriven.Employee WHERE idEmployee = ?"
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.json(err)
        return res.json(data[0])
    })
})



app.get("/employee/view/:dept_name", (req, res) => { // trying Employee type
    const q = `
    SELECT 	
        EventDriven.Employee.idEmployee,	
        EventDriven.departments.dept_name,
        EventDriven.Employee.lastname,
        EventDriven.Employee.firstname,
        EventDriven.designation.designation_name,
        EventDriven.status.status_name,
        EventDriven.assign_designation.employee_type
    FROM 
    EventDriven.assign_designation
    INNER JOIN 
        EventDriven.Employee ON EventDriven.assign_designation.idEmployee = EventDriven.Employee.idEmployee
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
    const q = "SELECT designation_id FROM EventDriven.designation WHERE designation_name = ?";
    db.query(q, [req.query.name], (err, data) => {
        if (err) { return res.json(err);}
        // if (data && data.length > 0 && data[0].designation_id) {
        return res.json(data[0].designation_id);
        // } else {
        //     return res.status(404).json({ error: 'Designation ID not found' });
        // }
    });
});


app.get("/status_id", (req, res) => {
    const q = "SELECT status_id FROM EventDriven.status WHERE status_name = ?"
    db.query(q, [req.query.name], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.json({ error: 'No status found with that name' })
        return res.json(data[0].status_id)
    })
})

app.post("/employee", (req, res) => {
    const q = "INSERT INTO EventDriven.Employee (firstname, middlename, lastname, addressline, barangay, province, country, zipcode) VALUES (?)"
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
        return res.json({ Employee: { idEmployee: data.insertId } })
    })
})

app.post("/assign_designation", (req, res) => { 
    const q = "INSERT INTO EventDriven.assign_designation (idEmployee, designation_id, status_id, employee_type) VALUES (?)"
    const values = [
        req.body.idEmployee,
        req.body.designation_id,
        req.body.status_id,
        req.body.employee_type
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json("Designation assigned successfully!")
    })
})

app.post("/assign_designation-update", (req, res) => {
    const q = "UPDATE EventDriven.assign_designation SET designation_id = ?, status_id = ?, employee_type = ? WHERE idEmployee = ?"
    const values = [
        req.body.designation_id,
        req.body.status_id,
        req.body.employee_type,
        req.body.idEmployee
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("Designation updated successfully!")
    })
})

app.put("/employee/:id", (req, res) => {
    const employeeId = req.params.id;
    const q = "UPDATE EventDriven.Employee SET `firstname`=?, `middlename`=?, `lastname`=?, `addressline`=?, `barangay`=?, `province`=?, `country`=?, `zipcode`=? WHERE idEmployee = ?"

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

app.delete ("/employee/:id", (req, res) => {
    const employeeId = req.params.id;
    const deleteAssignDesignationQuery = "DELETE FROM EventDriven.assign_designation WHERE idEmployee = ?";
    const deleteEmployeeQuery = "DELETE FROM EventDriven.Employee WHERE idEmployee = ?";

    db.query(deleteAssignDesignationQuery, employeeId, (err, data) => {
        if (err) return res.json(err);

        db.query(deleteEmployeeQuery, employeeId, (err, data) => {
            if (err) return res.json(err);
            return res.json("Employee deleted successfully!");
        });
    });
})

app.listen(3002, () => {
    console.log('Connect to backend server!')
    })