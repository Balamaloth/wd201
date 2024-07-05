/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
todo = require("../todo");

const {
  all,
  add,
  markAsComplete,
  overdue,
  dueToday,
  dueLater
} = todo();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};


var dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
);

const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });
});

// describe("Todo Test Suite", () => {
//   beforeAll(() => {
//     add({ title: "Submit assignment", dueDate: yesterday, completed: false });
//     add({ title: "Pay rent", dueDate: today, completed: true });
//     add({ title: "Service Vehicle", dueDate: today, completed: false });
//     add({ title: "File taxes", dueDate: tomorrow, completed: false });
//   });

//   test("Add Test Case", () => {
//     const len = all.length;

//     add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })
//     expect(all.length).toBe(len + 1);
//   });

//   test("Mark Complete!",()=>{
//     markAsComplete(0)
//     expect(all[0]['completed']).toBe(true)
//   })

//   test("Retriveal of Overdue Items",()=>{
//     const list = overdue()
//     expect(list.length).toBe(1)
//   })

//   test("Retriveal of DueToday Items",()=>{
//     const list = dueToday()
//     // console.log(list.length)
//     expect(list.length).toBe(2)
//   })

//   test("Retriveal of DueLater Items",()=>{
//     const list = dueLater()
//     // console.log(list.length)
//     expect(list.length).toBe(2)
//   })
  

// });
