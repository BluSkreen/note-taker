const notes = require("express").Router();
const util = require("util");
const fs = require("fs");
const { randomUUID } = require("crypto");

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
      id: randomUUID()
    };

    // console.log(readFromFile("./db/db.json").then((data) => JSON.parse(data)));

    // old (test)
    // fs.writeFile("./db/db.json",
    // JSON.stringify(readFromFile("./db/db.json").then((data) => new Array(JSON.parse(data)).push(newNote)), null, 4))

    // new (test)
    // readFromFile("./db/db.json").then((data) => JSON.stringify(new Array(JSON.parse(data)).push(newNote), null, 4)).then((newJson) => writeToFile("./db/db.json", newJson));

    // read the json file and add the new note
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            // get the data from the json file (parsed) and push the new note to the array
            parsedData.push(newNote);;
            fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 4), (err) => err ? console.error(err) : console.info("written"));
        }
    });

    res.json("Note added!");
  } else {
    res.error("Error in adding note");
  }
});

notes.delete("/:id", (req, res) => {
  // this function will handle the requests to delete a note from the database
  // console.log(req.params);

  // params has the id for the item we are trying to get rid of
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      // get the index of the id and splice it
      const index = parsedData.indexOf(req.params.id);
      parsedData.splice(index, 1);
      // write the new file
      fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 4), (err) =>
        err ? console.error(err) : console.info("written")
      );
    }
  });

  // res.json(req.body);
  res.json("Note removed!");
});

module.exports = notes;
