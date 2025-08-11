require("dotenv").config();
const express = require("express");
const logger = require("morgan");

const app = express();
app.use(express.json());

logger.token("body", (req, resp) =>
  req.method === "POST" ? JSON.stringify(req.body) : " "
);

app.use(
  logger(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateRandomId = () => {
  let id;

  do {
    id = Math.floor(Math.random() * 10000);
  } while (persons.some((person) => person.id === String(id)));

  return String(id);
};

app.get("/api/persons", (req, resp) => {
  resp.json(persons);
});

app.get("/info", (req, resp) => {
  const arrLen = persons.length;
  const contactsInfo = `Phonebook has info for ${arrLen} ${
    arrLen === 1 ? "person" : "people"
  }`;
  resp.send(`<p>${contactsInfo}</p><p>${new Date()}</p>`);
});

app.get("/api/persons/:id", (req, resp) => {
  const id = req.params.id;
  const target = persons.find((person) => person.id === id);

  if (!target) {
    return resp.status(404).end();
  }

  return resp.json(target);
});

app.delete("/api/persons/:id", (req, resp) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  resp.status(204).end();
});

app.post("/api/persons", (req, resp) => {
  const entry = req.body;

  if (!entry.name || !entry.number) {
    return resp.status(400).json({
      error: "Content missing",
    });
  }

  if (persons.some((person) => person.name === entry.name)) {
    return resp.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: generateRandomId(),
    ...entry,
  };
  persons = persons.concat(person);
  resp.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
