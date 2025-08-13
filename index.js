require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("dist"));
app.use(express.json());

logger.token("body", (req, resp) =>
  req.method === "POST" ? JSON.stringify(req.body) : " "
);

app.use(
  logger(":method :url :status :res[content-length] - :response-time ms :body")
);

// let p = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

const generateRandomId = () => {
  let id;

  do {
    id = Math.floor(Math.random() * 10000);
  } while (persons.some((person) => person.id === String(id)));

  return String(id);
};

app.get("/api/persons", (req, resp) => {
  Person.find({}).then((persons) => {
    resp.json(persons);
  });
});

app.get("/info", (req, resp) => {
  Person.find({}).then((persons) => {
    const arrLen = persons.length;
    const contactsInfo = `Phonebook has info for ${arrLen} ${
      arrLen === 1 ? "person" : "people"
    }`;
    resp.send(`<p>${contactsInfo}</p><p>${new Date()}</p>`);
  });
});

app.post("/api/persons", (req, resp) => {
  const entry = req.body;

  if (!entry.name || !entry.number) {
    return resp.status(400).json({
      error: "Content missing",
    });
  }

  Person.findOne({ name: entry.name })
    .then((person) => {
      if (person) {
        return resp.status(400).json({
          error: "Name must be unique",
        });
      }

      const newPerson = new Person({
        name: entry.name,
        number: entry.number,
      });

      return newPerson.save();
    })
    .then((savedPerson) => resp.json(savedPerson));
});

app.get("/api/persons/:id", (req, resp) => {
  const id = req.params.id;

  Person.findById(id).then((person) => {
    resp.json(person);
  });

  // if (!target) {
  //   return resp.status(404).end();
  // }
});

app.delete("/api/persons/:id", (req, resp) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  resp.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
