const notes = require("express").Router();
const util = require("util");
const fs = require("fs");

const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

function closeFd(fd) {
    close(fd, (err) => {
        if (err) throw err;
    });
}

notes.get("/", (req, res) => {
  // this function will handle the requests to get the notes
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notes.post("/", (req, res) => {
  // this function will handle the requests to post a note(saves it in the database)
  // readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
  // fs.createWriteStream("./db/db.json", );

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
    };

    // console.log(readFromFile("./db/db.json").then((data) => JSON.parse(data)));

    // old
    // fs.writeFile("./db/db.json",
    // JSON.stringify(readFromFile("./db/db.json").then((data) => new Array(JSON.parse(data)).push(newNote)), null, 4))

    // new
    // readFromFile("./db/db.json").then((data) => JSON.stringify(new Array(JSON.parse(data)).push(newNote), null, 4)).then((newJson) => writeToFile("./db/db.json", newJson));

    // fsUtils heroku
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);;
            fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 4), (err) => err ? console.error(err) : console.info("written"));
        }
    });

    res.json("Note added!");
  } else {
    res.error("Error in adding note");
  }
});

notes.delete("/", (req, res) => {
  // this function will handle the requests to delete a note from the database
});

module.exports = notes;
