const express = require("express");
const path = require("path");

const app = express();

const PORT = 5000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


let artifacts = [
    {
        id: 1,
        name: "Ancient Bronze Statue",
        category: "Sculpture",
        material: "Bronze",
        condition: "Good"
    },
    {
        id: 2,
        name: "Historic Ceramic Vase",
        category: "Pottery",
        material: "Ceramic",
        condition: "Moderate"
    },
    {
        id: 3,
        name: "Old Manuscript",
        category: "Document",
        material: "Paper",
        condition: "Poor"
    }
];


app.get("/api/dashboard", (req, res) => {

    const totalArtifacts = artifacts.length;

    const safeArtifacts =
        artifacts.filter(a => a.condition === "Good").length;

    const attentionArtifacts =
        artifacts.filter(a =>
            a.condition === "Moderate" ||
            a.condition === "Poor"
        ).length;

    const alerts =
        attentionArtifacts > 0 ? attentionArtifacts : 0;

    res.json({
        totalArtifacts,
        safeArtifacts,
        attentionArtifacts,
        alerts
    });
});

app.get("/api/artifacts", (req, res) => {

    res.json(artifacts);

});

app.post("/api/artifacts", (req, res) => {

    const {
        name,
        category,
        material,
        condition
    } = req.body;

    if (!name || !category || !material) {

        return res.status(400).json({
            message: "Please provide all required fields."
        });

    }

    const newArtifact = {

        id: artifacts.length > 0
            ? artifacts[artifacts.length - 1].id + 1
            : 1,

        name,
        category,
        material,
        condition: condition || "Good"
    };

    artifacts.push(newArtifact);

    res.status(201).json(newArtifact);

});


app.delete("/api/artifacts/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const originalLength = artifacts.length;

    artifacts =
        artifacts.filter(artifact => artifact.id !== id);

    if (artifacts.length === originalLength) {

        return res.status(404).json({
            message: "Artifact not found."
        });

    }

    res.json({
        message: "Artifact deleted successfully."
    });

});


app.get("/api/environment", (req, res) => {

    // Simulated sensor values
    const temperature =
        Number((20 + Math.random() * 10).toFixed(1));

    const humidity =
        Number((45 + Math.random() * 25).toFixed(1));

    let status = "SAFE";

    if (temperature > 28 || humidity > 65) {
        status = "WARNING";
    }

    if (temperature > 30 || humidity > 75) {
        status = "DANGER";
    }

    res.json({
        temperature,
        humidity,
        status
    });

});


app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

app.listen(PORT, () => {

    console.log(
        `Smart Museum Preservation Platform running at http://localhost:${PORT}`
    );

});
