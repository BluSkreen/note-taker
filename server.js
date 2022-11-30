const express = require("express");
const path = require("path");
const api = require("./routes/notes.js")

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

// GET html routes
// homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API routes
// notes.js will handle the api/notes routes
app.use("/api/notes", api);

// display when the server is listening
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));