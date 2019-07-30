const Joi = require("@hapi/joi");
const express = require("express");
const app = express();

// It act as a middleware to expect Json object
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

/**
 * GET API
 */
app.get("/", (req, res) => {
  res.send("Hello World !!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// http://localhost:3002/api/courses/10
app.get("/api/courses/:id", (req, res) => {
  // res.send(req.params.id);
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course with given ID not found");
  else res.send(course);
});

// http://localhost:3002/api/courses/10/2020
// http://localhost:3002/api/courses/10/2020?name=akshay
app.get("/api/courses/:month/:year", (req, res) => {
  // res.send(req.params);
  res.send(req.query);
});

/**
 * POST API
 */
app.post("/api/courses", (req, res) => {
  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

/**
 * PUT API
 */
app.put("/api/courses/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course with given ID not found");

  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

/**
 * DELETE API
 */
app.delete("/api/courses/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course with given ID not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

// PORT
const port = process.env.PORT || 3002;
// to set port no
// export PORT=5000

app.listen(port, () => console.log(`Listening on port ${port}`));
