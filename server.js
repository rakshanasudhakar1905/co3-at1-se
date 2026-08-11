const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();

const PORT = 5000;


app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


const db = mysql.createPool({

    host: process.env.DB_HOST || "localhost",

    user: process.env.DB_USER || "museum_user",

    password: process.env.DB_PASSWORD || "museum_pass",

    database: process.env.DB_NAME || "museum_db",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});



async function testDatabase() {

    try {

        const connection =
            await db.getConnection();

        console.log(
            "MySQL database connected successfully."
        );

        connection.release();

    }
    catch (error) {

        console.error(
            "Database connection failed:",
            error.message
        );

    }

}


app.get(
    "/api/dashboard",
    async (req, res) => {

        try {

            const [total] =
                await db.query(
                    "SELECT COUNT(*) AS count FROM artifacts"
                );


            const [safe] =
                await db.query(
                    "SELECT COUNT(*) AS count FROM artifacts WHERE condition_status = 'Good'"
                );


            const [attention] =
                await db.query(
                    `SELECT COUNT(*) AS count
                     FROM artifacts
                     WHERE condition_status IN ('Moderate', 'Poor')`
                );


            res.json({

                totalArtifacts:
                    total[0].count,

                safeArtifacts:
                    safe[0].count,

                attentionArtifacts:
                    attention[0].count,

                alerts:
                    attention[0].count

            });

        }
        catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Database error"
            });

        }

    }
);

app.get(
    "/api/artifacts",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(
                    "SELECT * FROM artifacts ORDER BY id"
                );

            res.json(rows);

        }
        catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Database error"
            });

        }

    }
);

app.post(
    "/api/artifacts",
    async (req, res) => {

        try {

            const {
                name,
                category,
                material,
                condition
            } = req.body;


            if (
                !name ||
                !category ||
                !material
            ) {

                return res.status(400).json({

                    message:
                        "All fields are required."

                });

            }


            const [result] =
                await db.execute(

                    `INSERT INTO artifacts
                    (name, category, material, condition_status)
                    VALUES (?, ?, ?, ?)`,

                    [
                        name,
                        category,
                        material,
                        condition || "Good"
                    ]

                );


            res.status(201).json({

                id: result.insertId,

                name,

                category,

                material,

                condition: condition || "Good"

            });

        }
        catch (error) {

            console.error(error);

            res.status(500).json({

                message:
                    "Unable to add artifact."

            });

        }

    }
);
app.delete(
    "/api/artifacts/:id",
    async (req, res) => {

        try {

            const id =
                parseInt(req.params.id);


            const [result] =
                await db.execute(

                    "DELETE FROM artifacts WHERE id = ?",

                    [id]

                );


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    message:
                        "Artifact not found."

                });

            }


            res.json({

                message:
                    "Artifact deleted successfully."

            });

        }
        catch (error) {

            console.error(error);

            res.status(500).json({

                message:
                    "Database error."

            });

        }

    }
);

app.get(
    "/api/alerts",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(

                    `SELECT *
                     FROM artifacts
                     WHERE condition_status
                     IN ('Moderate', 'Poor')
                     ORDER BY id`

                );


            res.json(rows);

        }
        catch (error) {

            console.error(error);

            res.status(500).json({

                message:
                    "Database error."

            });

        }

    }
);

app.get(
    "/api/environment",
    (req, res) => {

        const temperature =
            Number(
                (
                    20 +
                    Math.random() * 10
                ).toFixed(1)
            );


        const humidity =
            Number(
                (
                    45 +
                    Math.random() * 25
                ).toFixed(1)
            );


        let status = "SAFE";


        if (
            temperature > 28 ||
            humidity > 65
        ) {

            status = "WARNING";

        }


        if (
            temperature > 30 ||
            humidity > 75
        ) {

            status = "DANGER";

        }


        res.json({

            temperature,

            humidity,

            status

        });

    }
);

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "index.html"
            )
        );

    }
);

app.listen(
    PORT,
    () => {

        console.log(
            `Smart Museum Preservation Platform running on port ${PORT}`
        );

        testDatabase();

    }
);
