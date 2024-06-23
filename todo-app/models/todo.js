"use strict";
const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      if (!dueDate) {
        throw new Error('Due date is required.');
      }

      return this.create({ title, dueDate, completed: false });
    }

    static async markAsCompleted(id) {
      const todo = await this.findByPk(id);
      if (!todo) {
        throw new Error('Todo not found.');
      }

      if (todo.dueDate < new Date()) {
        throw new Error('Cannot mark overdue item as completed.');
      }

      return todo.update({ completed: true });
    }

    toggleCompletion() {
      return this.update({ completed: !this.completed });
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Sequelize.Op.lt]: new Date(),
          },
          completed: false,
        },
      });
    }

    static async completed() {
      return this.findAll({
        where: {
          completed: true,
        },
      });
    }

    static async dueToday() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.findAll({
        where: {
          dueDate: today,
          completed: false,
        },
      });
    }

    static async dueLater() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.findAll({
        where: {
          dueDate: {
            [Sequelize.Op.gt]: today,
          },
          completed: false,
        },
      });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    static async markSampleOverdueItemAsCompleted() {
      const sampleOverdueItem = await this.findOne({
        where: {
          dueDate: {
            [Sequelize.Op.lt]: new Date(),
          },
          completed: false,
        },
      });

      if (sampleOverdueItem) {
        await sampleOverdueItem.update({ completed: true });
      }
    }
  }

  Todo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
