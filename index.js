const express = require("express");
const app = express();
let requests = 0;

app.use(express.json());
app.use(countRequests);

app.listen(3000);

const projects = [];

function countRequests(req, res, next) {
  console.log("Requisições:" + ++requests);

  next();
}

function projectExists(req, res, next) {
  const { id } = req.params;

  if (!findProjectById(id)) {
    return res.status(404).json("Project not found");
  }

  return next();
}

function hasTitle(req, res, next) {
  if (!req.body.title) {
    return res.status(404).json("Project Title is required");
  }

  return next();
}

function validateProject(req, res, next) {
  const { id, title } = req.body;

  if (!id) {
    return res.status(404).json({ error: "Project ID is required" });
  }

  if (!title) {
    return res.status(404).json({ error: "Project Title is required" });
  }

  return next();
}

function validateTask(req, res, next) {
  if (!req.body.title) {
    return res.status(404).json({ error: "Task Title is required" });
  }

  return next();
}

function findProjectById(id) {
  return projects.find(p => p.id == id);
}

app.get("/projects/", (req, res) => {
  return res.json(projects);
});

app.post("/projects/", validateProject, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

app.put("/projects/:id", projectExists, hasTitle, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = findProjectById(id);

  project.title = title;

  return res.json(project);
});

app.delete("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;

  const project = findProjectById(id);

  projects.pop(project);

  return res.send();
});

app.post("/projects/:id/tasks", projectExists, validateTask, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = findProjectById(id);

  project.tasks.push(title);

  return res.json(project);
});
