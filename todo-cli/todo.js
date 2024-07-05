/* eslint-disable no-undef */
const todoList = () => {
    all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }
  
    const overdue = () => {
      // Write the date check condition here and return the array
      // of overdue items accordingly.
      let today = new Date();
      today.setHours(0,0,0,0)

      let newTodo = all.filter((item)=>{
          let givenDate = new Date(item.dueDate)
          givenDate.setHours(0,0,0,0)
          return givenDate < today;
      })
      
      return newTodo;
    }
  
    const dueToday = () => {
      // Write the date check condition here and return the array
      // of todo items that are due today accordingly.
      let today = new Date();
      today=formattedDate(today)

      let newTodo = all.filter((item)=>{
          return item.dueDate === today;
      })
      
      return newTodo;
    }

  
    const dueLater = () => {
      // Write the date check condition here and return the array
      // of todo items that are due later accordingly.
     let today = new Date();
      today.setHours(0,0,0,0)

      let newTodo = all.filter((item)=>{
          let givenDate = new Date(item.dueDate)
          givenDate.setHours(0,0,0,0)
          return givenDate > today;
      })
      
      return newTodo;
    }
  
    const toDisplayableList = (list) => {
      // Format the To-Do list here, and return the output string
      // as per the format given above.
      let len = list.length
      let resStr = ""
      for(let i=0;i<len;i++){
          let str = "["
          list[i].completed ? str+="x] " : str+=" ] "
          str+=list[i].title
          
          if(list[i].dueDate!==today){
              str+=(" "+list[i].dueDate)
          }
          
          resStr +=(str)
          if(i!==(len-1))
          {
              // console.log("inside")
              resStr+='\n'
          }
      }
      
      return resStr
      
    }
  
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
 
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #

  
  const formattedDate = d => {
    return d.toISOString().split("T")[0]
  }

    
  // const todos = todoList();
  
  // var dateToday = new Date()
  // const today = formattedDate(dateToday)
  // const yesterday = formattedDate(
  //   new Date(new Date().setDate(dateToday.getDate() - 1))
  // )
  // const tomorrow = formattedDate(
  //   new Date(new Date().setDate(dateToday.getDate() + 1))
  // )
  
  
  // todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
  // todos.add({ title: 'Pay rent', dueDate: today, completed: true })
  // todos.add({ title: 'Service Vehicle', dueDate: today, completed: false })
  // todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })
  // todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })
  
  // console.log("My Todo-list\n")
  
  // console.log("Overdue")
  // var overdues = todos.overdue()
  // var formattedOverdues = todos.toDisplayableList(overdues)
  // console.log(formattedOverdues)
  // console.log("\n")
  
  // console.log("Due Today")
  // let itemsDueToday = todos.dueToday()
  // let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
  // console.log(formattedItemsDueToday)
  // console.log("\n")
  
  // console.log("Due Later")
  // let itemsDueLater = todos.dueLater()
  // let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
  // console.log(formattedItemsDueLater)
  // console.log("\n\n")


   
  module.exports = todoList