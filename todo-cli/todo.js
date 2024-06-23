const formattedDate = d => {
  return d.toISOString().split("T")[0];
};

const todoList = () => {
  const all = [];

  const add = (todoItem) => {
    all.push(todoItem);
  };

  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    const today = formattedDate(new Date());
    return all.filter(todo => !todo.completed && todo.dueDate < today);
  };

  const dueToday = () => {
    const today = formattedDate(new Date());
    return all.filter(todo => todo.dueDate === today);
  };

  const dueLater = () => {
    const today = formattedDate(new Date());
    return all.filter(todo => !todo.completed && todo.dueDate > today);
  };

  const toDisplayableList = (list) => {
    let displayableList = '';

    const today = formattedDate(new Date());

    list.forEach(todo => {
      let status = todo.completed ? '[x]' : '[ ]';
      let formattedTodo = `${status} ${todo.title}`;

      if (todo.dueDate === today) {
        displayableList += `${formattedTodo}\n`;
      } else {
        displayableList += `${formattedTodo} ${todo.dueDate}\n`;
      }
    });

    return displayableList.trim();
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList
  };
};

module.exports = todoList;
