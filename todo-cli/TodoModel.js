const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB.js");

class Todo extends Model {

  static async addTask(params){
    return await Todo.create(params);
  }

  displayableString(){
    return `${this.completed ? '[x]' : '[]'} ${this.id}. ${this.title} - ${this.dueDate}`
  }
}
Todo.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  }
);

Todo.sync();
module.exports = Todo;