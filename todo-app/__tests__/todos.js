const request = require("supertest");
const db = require("../models/index");
const cheerio = require("cheerio");
const app = require("../app");

let server, agent;

// Function to extract CSRF token from response
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Test Suite", () => {
  // Setup before running tests
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  // Clean up after running tests
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  // Test case for creating a new todo with empty dueDate
  test("Creating a new todo with empty dueDate should fail", async () => {
    // Perform GET request to fetch CSRF token
    const res = await agent.get("/todo");
    const csrfToken = extractCsrfToken(res);

    // Perform POST request to create a new todo with empty dueDate
    const response = await agent.post("/todo").send({
      title: "Buy Milk",
      dueDate: "", // Empty dueDate
      completed: false,
      _csrf: csrfToken,
    });

    // Expect a specific error response code
    expect(response.statusCode).toBe(400);
  });

  // Test case for marking overdue item as completed
  test("Marking overdue item as completed should fail", async () => {
    // Perform GET request to fetch CSRF token
    const res = await agent.get("/todo");
    const csrfToken = extractCsrfToken(res);

    // Create a todo item with a past dueDate
    const overdueResponse = await agent.post("/todo").send({
      title: "Overdue Task",
      dueDate: new Date("2022-01-01").toISOString(), // Past dueDate
      completed: false,
      _csrf: csrfToken,
    });
    const overdueItemId = overdueResponse.body.id;

    // Mark the overdue item as completed
    const markCompletedResponse = await agent
      .put(`/todo/${overdueItemId}`)
      .send({
        _csrf: csrfToken,
        completed: true,
      });

    // Expect a specific error response code
    expect(markCompletedResponse.statusCode).toBe(400);
  });

  // Test case for toggling completed item
  test("Toggling completed item should work", async () => {
    // Perform GET request to fetch CSRF token
    const res = await agent.get("/todo");
    const csrfToken = extractCsrfToken(res);

    // Create a todo item
    const newTodoResponse = await agent.post("/todo").send({
      title: "New Task",
      dueDate: new Date().toISOString(), // Current date dueDate
      completed: false,
      _csrf: csrfToken,
    });
    const newTodoItemId = newTodoResponse.body.id;

    // Mark the todo item as completed
    const markCompletedResponse = await agent
      .put(`/todo/${newTodoItemId}`)
      .send({
        _csrf: csrfToken,
        completed: true,
      });

    // Expect success
    expect(markCompletedResponse.statusCode).toBe(200);

    // Toggle the completed status of the todo item
    const toggleCompletedResponse = await agent
      .put(`/todo/${newTodoItemId}`)
      .send({
        _csrf: csrfToken,
        completed: false,
      });

    // Expect success
    expect(toggleCompletedResponse.statusCode).toBe(200);
  });

  // Test case for deleting a todo
  test("Deleting a Todo", async () => {
    // Perform GET request to fetch CSRF token
    const res = await agent.get("/todo");
    const csrfToken = extractCsrfToken(res);

    // Create a todo item
    const newTodoResponse = await agent.post("/todo").send({
      title: "New Task",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const newTodoItemId = newTodoResponse.body.id;

    // Delete the todo item
    const deleteResponse = await agent
      .delete(`/todo/${newTodoItemId}`)
      .send({ _csrf: csrfToken });

    // Expect success
    expect(deleteResponse.statusCode).toBe(200);
  });
});
