require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("dist"));
app.use(express.json());

logger.token("body", (req, resp) =>
  req.method === "POST" || req.method === "PUT" ? JSON.stringify(req.body) : " "
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

app.get("/api/persons", (req, resp, next) => {
  Person.find({})
    .then((persons) => {
      resp.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, resp, next) => {
  Person.find({})
    .then((persons) => {
      const arrLen = persons.length;
      const contactsInfo = `Phonebook has info for ${arrLen} ${
        arrLen === 1 ? "person" : "people"
      }`;
      resp.send(`<p>${contactsInfo}</p><p>${new Date()}</p>`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, resp, next) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        resp.json(person);
      } else {
        resp.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, resp, next) => {
  const entry = req.body;

  // if (!entry.number) {
  //   return resp.status(400).json({
  //     error: "Content missing",
  //   });
  // }

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

      return newPerson.save().then((savedPerson) => resp.json(savedPerson));
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, resp, next) => {
  const { name, number } = req.body;

  // if (!number) {
  //   return resp.status(400).json({
  //     error: "Content missing",
  //   });
  // }
  const id = req.params.id;

  // return next(new Error("Simulated internal server error"));

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return resp.status(404).end();
      }
      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => resp.json(updatedPerson));
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, resp, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => resp.status(204).end())
    .catch((error) => next(error));
});

const unknownEndpoint = (req, resp) => {
  resp.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, resp, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return resp.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    // console.log("Start: ", error.errors.name.properties.message);
    console.log(error.errors);
    return resp.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
