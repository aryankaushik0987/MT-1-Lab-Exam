const express = require('express');

const app = express();

app.use(express.json());

// Sample Patient Records
let patients = [
    {
        id: 1,
        name: "Amit Kumar",
        age: 35,
        disease: "Fever",
        doctorName: "Dr. Sharma"
    },
    {
        id: 2,
        name: "Rahul Verma",
        age: 28,
        disease: "Cold",
        doctorName: "Dr. Gupta"
    },
    {
        id: 3,
        name: "Priya Singh",
        age: 40,
        disease: "Diabetes",
        doctorName: "Dr. Mehta"
    }
];

// Function to validate patient details
function isValidPatient(patient) {
    return patient &&
        patient.id !== undefined &&
        patient.name &&
        patient.age !== undefined &&
        patient.disease &&
        patient.doctorName;
}

// 1. GET - Retrieve All Patients
app.get('/patients', (req, res) => {

    res.status(200).json(patients);

});

// 2. GET - Retrieve Patient By ID
app.get('/patients/:id', (req, res) => {

    const id = Number(req.params.id);

    const patient = patients.find(p => p.id === id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    res.status(200).json(patient);

});

// 3. POST - Add New Patient
app.post('/patients', (req, res) => {

    const patient = req.body;

    if (!isValidPatient(patient)) {
        return res.status(400).json({
            message: "All patient fields are required"
        });
    }

    if (patients.some(p => p.id === Number(patient.id))) {
        return res.status(409).json({
            message: "Patient ID already exists"
        });
    }

    patients.push({
        ...patient,
        id: Number(patient.id)
    });

    res.status(201).json({
        message: "Patient added successfully",
        patient: patient
    });

});

// 4. PUT - Update Patient
app.put('/patients/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = patients.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    const updatedPatient = {
        ...patients[index],
        ...req.body,
        id: id
    };

    if (!isValidPatient(updatedPatient)) {
        return res.status(400).json({
            message: "Invalid patient details"
        });
    }

    patients[index] = updatedPatient;

    res.status(200).json({
        message: "Patient updated successfully",
        patient: updatedPatient
    });

});

// 5. DELETE - Delete Patient
app.delete('/patients/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = patients.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    const deletedPatient = patients.splice(index, 1);

    res.status(200).json({
        message: "Patient deleted successfully",
        patient: deletedPatient[0]
    });

});

// Handle Invalid Routes
app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});

// Handle Invalid JSON and Other Errors
app.use((err, req, res, next) => {

    res.status(400).json({
        message: "Invalid request",
        error: err.message
    });

});

// Start Express Server
app.listen(4000, () => {

    console.log("Express Server running at http://localhost:4000");

});