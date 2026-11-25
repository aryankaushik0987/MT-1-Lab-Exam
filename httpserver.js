const http = require('http');

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

const server = http.createServer((req, res) => {

    // Route 1: Home Page
    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end("<h1>Welcome to Hospital Patient Management System</h1>");
    }

    // Route 2: Get All Patients
    else if (req.url === "/patients" && req.method === "GET") {

        res.writeHead(200, { "Content-Type": "application/json" });

        res.end(JSON.stringify(patients));
    }

    // Route 3: Hospital Information
    else if (req.url === "/about" && req.method === "GET") {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end("<h1>About Our Hospital</h1><p>We provide quality healthcare services.</p>");
    }

    // Route 4: Add New Patient
    else if (req.url === "/add-patient" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {
                const patient = JSON.parse(body);

                if (
                    patient.id === undefined ||
                    !patient.name ||
                    patient.age === undefined ||
                    !patient.disease ||
                    !patient.doctorName
                ) {
                    res.writeHead(400, { "Content-Type": "application/json" });

                    return res.end(JSON.stringify({
                        message: "All patient fields are required"
                    }));
                }

                if (patients.some(p => p.id === patient.id)) {
                    res.writeHead(409, { "Content-Type": "application/json" });

                    return res.end(JSON.stringify({
                        message: "Patient ID already exists"
                    }));
                }

                patients.push(patient);

                res.writeHead(201, { "Content-Type": "application/json" });

                res.end(JSON.stringify({
                    message: "Patient added successfully",
                    patient: patient
                }));

            } catch (error) {

                res.writeHead(400, { "Content-Type": "application/json" });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }

    // Invalid Route
    else {

        res.writeHead(404, { "Content-Type": "text/html" });

        res.end("<h1>404 - Page Not Found</h1>");
    }

});

// Start Server
server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});