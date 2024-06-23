"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    
    static async addTask(params) {
      try {
        return await Todo.create(params);
      } catch (error) {
        console.error("Error adding a task", error);
      }
    }

    static async getTasks() {
      try {
        return await Todo.findAll();
      } catch (error) {
        console.error("Error getting tasks", error);
      }
    }

    static associate(models) {
      
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const dueDateISO = new Date(this.dueDate).toISOString().split("T")[0];
      const date =
        dueDateISO === new Date().toISOString().split("T")[0] ? "" : dueDateISO;
      const todoStr = `${this.id}. ${checkbox} ${this.title} ${date}`;
      return todoStr.trim();
    }

    static async markAsComplete(id) {
      try {
        const todo = await Todo.update({ completed: true }, { where: { id } });
      } catch (error) {
        console.error("Error marking a todo as complete", error);
      }
    }

    static async overdue() {
      try {
        const todos = await Todo.findAll({
          order: [["id", "ASC"]],
        });
        return todos.filter((todo) => new Date(todo.dueDate) < new Date());
      } catch (error) {
        console.error("Error getting overdue tasks", error);
      }
    }

    static async dueToday() {
      try {
        const todos = await Todo.findAll({
          order: [["id", "ASC"]],
        });
        return todos.filter(
          (todo) =>
            new Date(todo.dueDate).toDateString() === new Date().toDateString()
        );
      } catch (error) {
        console.error("Error getting due today tasks", error);
      }
    }

    static async dueLater() {
      try {
        const todos = await Todo.findAll({
          order: [["id", "ASC"]],
        });
        return todos.filter((todo) => new Date(todo.dueDate) > new Date());
      } catch (error) {
        console.error("Error getting due later tasks", error);
      }
    }

    static async showList() {
      console.log("My Todo list \n");

      const overdue = await this.overdue();
      const dueToday = await this.dueToday();
      const dueLater = await this.dueLater();

      console.log("Overdue");
      overdue.forEach((todo) => console.log(todo.displayableString()));
      console.log("");

      console.log("Due Today");
      dueToday.forEach((todo) => console.log(todo.displayableString()));
      console.log("");

      console.log("Due Later");
      dueLater.forEach((todo) => console.log(todo.displayableString()));
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};