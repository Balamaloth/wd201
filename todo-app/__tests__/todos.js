/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");

let server, agent;
let csrfToken;

const extractCSRF = (res) => {
  let $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
};

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCSRF(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

const firstName = "firstName";
const lastName = "lastName";
const email = "e@1.co";
const password = "12345678";

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  // test("Create Todo", () => {
  //   expect(true).toBe(true);
  // });

  test("Signup", async () => {
    const r = await agent.get("/signup");
    csrfToken = extractCSRF(r);

    const res = await agent.post("/users").send({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      _csrf: csrfToken,
    });

    expect(res.statusCode).toBe(302);
  });

  test("Create Todo", async () => {
    const agent = request.agent(server);
    await login(agent, email, password);

    const r = await agent.get("/todos");
    csrfToken = extractCSRF(r);

    const res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    expect(res.statusCode).toBe(302);
  });

  test("mark todo as completed", async () => {
    const agent = request.agent(server);
    await login(agent, email, password);
    const r = await agent.get("/todos");
    const csrfToken = extractCSRF(r);
    let res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    let allTodos = await agent.get("/todos").set("Accept", "application/json");

    allTodos = JSON.parse(allTodos.text);
    let todosToday = allTodos.duetoday[allTodos.duetoday.length - 1];

    const id = todosToday.id;

    res = await agent.put(`/todos/${id}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    parsedResponse = JSON.parse(res.text);
    expect(parsedResponse.completed).toBe(true);
  });

  test("Delete Todo", async () => {
    const agent = request.agent(server);
    await login(agent, email, password);
    const r = await agent.get("/todos");
    const csrfToken = extractCSRF(r);
    let res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    let allTodos = await agent.get("/todos").set("Accept", "application/json");

    allTodos = JSON.parse(allTodos.text);
    let todosToday = allTodos.duetoday[allTodos.duetoday.length - 1];

    const id = todosToday.id;

    res = await agent.delete(`/todos/${id}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    parsedResponse = JSON.parse(res.text);
    expect(parsedResponse).toBe(true);
  });

  test("Signout", async () => {
    const agent = request.agent(server);
    await login(agent, email, password);
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);

    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);

    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });
});
